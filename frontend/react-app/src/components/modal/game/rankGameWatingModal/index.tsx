import Modal from "react-modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import LoadingImage from "@src/assets/images/loading.gif";
import { gameSocket } from "@src/router/socket/gameSocket";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { GameRoomInfoType, UserType } from "@src/types";
import { gameRoomInfoState, gameRoomURLState } from "@src/recoil/atoms/game";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface RankGameWatingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const RankGameWatingModal = ({
  isOpen,
  setIsOpen,
}: RankGameWatingModalProps) => {
  const [userData] = useRecoilState(userDataState);
  const setGameRoomInfo = useSetRecoilState(gameRoomInfoState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const [getMatched, setGetMatched] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    gameSocket.on("joinRankGame", (data) => {
      const participantsIdList = (data.participants as UserType[]).map(
        (user) => user.id,
      );
      const gameRoom = data.gameRoom as GameRoomInfoType;
      if (!participantsIdList.includes(userData.id)) return;
      setGameRoomInfo(gameRoom);
      setGameRoomURL(gameRoom.roomURL);
      setGetMatched(true);
      setTimeout(() => {
        setIsOpen(false);
        navigate(`/game/${gameRoom.roomURL}`);
      }, 5000);
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: S.ModalContent,
      }}
    >
      {getMatched ? (
        <>
          <div>매칭이 잡혔습니다</div>
        </>
      ) : (
        <>
          <div>매칭 대기중</div>
          <S.LoadingImageStyle src={LoadingImage} />
          <IconButton
            title="취소"
            onClick={() => {
              gameSocket.emit("cancleRankGame", {
                user: userData,
              });
              setIsOpen(false);
            }}
            theme="LIGHT"
          />
        </>
      )}
    </Modal>
  );
};
