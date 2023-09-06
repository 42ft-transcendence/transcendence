import {
  gameRoomInfoInitState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import Modal from "react-modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import { GameRoomInfoType } from "@src/types";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameSocket } from "@src/router/socket/gameSocket";
import { userDataState } from "@src/recoil/atoms/common";
import { useNavigate } from "react-router-dom";

interface GameRoomEnterModalProps {
  gameRoomInfo: GameRoomInfoType;
  setSelectGameRoom: React.Dispatch<
    React.SetStateAction<GameRoomInfoType | undefined>
  >;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameRoomEnterModal = ({
  gameRoomInfo,
  setSelectGameRoom,
  isOpen,
  setIsOpen,
}: GameRoomEnterModalProps) => {
  const [password, setPassword] = useState<string>("");
  const [userData] = useRecoilState(userDataState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setSelectGameRoom(gameRoomInfoInitState);
    setIsOpen(false);
  };

  const handleEnterButton = () => {
    if (gameRoomInfo.numberOfParticipants === 2) {
      alert("인원이 가득 찼습니다.");
      return;
    }
    if (
      gameRoomInfo.roomType === "PROTECTED" &&
      password !== gameRoomInfo.roomPassword
    ) {
      alert("비밀번호가 틀렸습니다.");
      setPassword("");
      return;
    }
    gameSocket.emit("enterGameRoom", {
      gameRoomURL: gameRoomInfo.roomURL,
      user: userData,
    });
    setGameRoomURL(gameRoomInfo.roomURL);
    setIsOpen(false);
    navigate(`/game/${gameRoomInfo.roomURL}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: S.ModalContent,
        overlay: S.ModalOverlay,
      }}
    >
      <S.ModalMessage>게임 방에 입장하겠습니까?</S.ModalMessage>
      <S.PasswordContainer>
        {gameRoomInfo.roomType === "PROTECTED" && (
          <S.PasswordInput
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </S.PasswordContainer>
      <S.ButtonContainer>
        <IconButton title="닫기" onClick={handleCloseModal} theme="LIGHT" />
        <IconButton title="입장" onClick={handleEnterButton} theme="LIGHT" />
      </S.ButtonContainer>
    </Modal>
  );
};

export default GameRoomEnterModal;
