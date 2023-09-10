import Modal from "react-modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import LoadingImage from "@src/assets/images/loading.gif";
import { gameSocket } from "@src/router/socket/gameSocket";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { GameRoomInfoType, UserType } from "@src/types";
import {
  gameModalState,
  gameRoomInfoInitState,
  gameRoomInfoState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface RankGameWaitingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const RankGameWaitingModal = ({
  isOpen,
  setIsOpen,
}: RankGameWaitingModalProps) => {
  const [userData] = useRecoilState(userDataState);
  const setGameRoomInfo = useSetRecoilState(gameRoomInfoState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const [getMatched, setGetMatched] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(5);
  const setGameModal = useSetRecoilState(gameModalState);
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
      setGameModal({ gameMap: null });
      setTimeout(() => {
        setIsOpen(false);
        navigate(`/game/${gameRoom.roomURL}`);
      }, 5000);
      startCountdown(gameRoom.roomURL);
    });
  });

  const startCountdown = (url: string) => {
    let countdownValue = 5; // 시작 카운트다운 값
    setCountdown(countdownValue);

    const interval = setInterval(() => {
      countdownValue -= 1; // 1씩 감소
      setCountdown(countdownValue);
      if (countdownValue === 0) {
        clearInterval(interval);
        setIsOpen(false);
        navigate(`/game/${url}`);
      }
    }, 1000);
  };

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
          <div>매칭이 잡혔습니다.</div>
          <div>잠시 후 게임이 시작됩니다.</div>
          <div>{countdown}</div>
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
              setGameRoomInfo(gameRoomInfoInitState);
              setGameModal({ gameMap: null });
              setIsOpen(false);
            }}
            theme="LIGHT"
          />
        </>
      )}
    </Modal>
  );
};
