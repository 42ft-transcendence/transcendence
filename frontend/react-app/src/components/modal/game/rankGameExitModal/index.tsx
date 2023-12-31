import Modal from "react-modal";
import * as DS from "../index.styled";
import * as S from "./index.styled";
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
import { useEffect } from "react";
import { IconButton } from "@src/components/buttons";

interface RankGameExitModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const RankGameExitModal = ({
  isOpen,
  setIsOpen,
}: RankGameExitModalProps) => {
  const [userData] = useRecoilState(userDataState);
  const setGameRoomInfo = useSetRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const setGameModal = useSetRecoilState(gameModalState);

  useEffect(() => {
    gameSocket.on("joinRankGame", (data) => {
      const participantsIdList = (data.participants as UserType[]).map(
        (user) => user.id,
      );
      const gameRoom = data.gameRoom as GameRoomInfoType;
      if (!participantsIdList.includes(userData.id)) return;
      setGameModal({ gameMap: null });
      setGameRoomInfo(gameRoom);
      setGameRoomURL(gameRoom.roomURL);
    });
  });

  const handleExit = () => {
    gameSocket.emit("exitRankGameRoom", {
      gameRoomURL: gameRoomURL,
      user: userData,
    });
    setGameRoomInfo(gameRoomInfoInitState);
    setIsOpen(false);
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
      <div>게임에서 나가시겠습니까?</div>
      <div>레이팅 점수가 하락합니다.</div>
      <DS.ButtonContainer>
        <IconButton
          title="취소"
          onClick={() => setIsOpen(false)}
          theme="LIGHT"
        />
        <IconButton title="나가기" onClick={handleExit} theme="LIGHT" />
      </DS.ButtonContainer>
    </Modal>
  );
};
