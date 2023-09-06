import Modal from "react-modal";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { IconButton } from "@components/buttons";
import React, { useEffect, useState } from "react";
import { GameRoomInfoType, GameRoomType } from "@src/types";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";

const GameRoomTypeMap: {
  PUBLIC: string;
  PROTECTED: string;
  PRIVATE: string;
  [key: string]: string;
} = {
  PUBLIC: "공개",
  PROTECTED: "비밀",
  PRIVATE: "비공개",
};

const SPEED_OPTIONS = [
  { key: "SLOW", label: "느리게" },
  { key: "NORMAL", label: "보통" },
  { key: "FAST", label: "빠르게" },
];

interface GameEditModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameRoomInfo: GameRoomInfoType;
}

const GameEditModal = ({
  isOpen,
  setIsOpen,
  gameRoomInfo,
}: GameEditModalProps) => {
  const [speed, setSpeed] = useState(gameRoomInfo.gameMode);
  const [type, setType] = useState<string>(gameRoomInfo.roomType);
  const [roomName, setRoomName] = useState<string>(gameRoomInfo.roomName);
  const [password, setPassword] = useState<string>("");
  const [gameRoomURL] = useRecoilState(gameRoomURLState);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const onSubmit = async () => {
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: gameRoomURL,
      infoType: "roomType",
      info: type as GameRoomType,
    });
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: gameRoomURL,
      infoType: "roomName",
      info: roomName,
    });
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTypeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (type === "PUBLIC") {
      setType("PROTECTED");
    } else if (type === "PROTECTED") {
      setType("PRIVATE");
    } else {
      setType("PUBLIC");
    }
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: gameRoomURL,
      infoType: "roomPassword",
      info: event.target.value,
    });
  };

  useEffect(() => {
    if (isOpen) {
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: gameRoomURL,
        infoType: "gameMode",
        info: speed,
      });
    }
  }, [speed]);

  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: { ...DS.ModalContent }, // Spread 연산자 사용
        overlay: { ...DS.ModalOverlay }, // Spread 연산자 사용
      }}
    >
      <DS.InputBoxWrapper
        type="text"
        placeholder="방 제목"
        id="nickname"
        value={roomName}
        onChange={handleTitleChange}
        maxLength={23}
      />
      <DS.GameSpeedButtons>
        <DS.gameCreateModalLabel>속도</DS.gameCreateModalLabel>
        {SPEED_OPTIONS.map((option) => (
          <DS.GameSpeedButton
            key={option.key}
            $selected={speed === option.key}
            onClick={() => setSpeed(option.key)}
          >
            {option.label}
          </DS.GameSpeedButton>
        ))}
      </DS.GameSpeedButtons>
      <DS.gameCreateOption>
        <DS.gameCreateModalLabel>맵 선택</DS.gameCreateModalLabel>
        <DS.mapbox />
      </DS.gameCreateOption>
      <DS.gameCreateOption>
        <DS.gameCreateModalLabel>채널 유형</DS.gameCreateModalLabel>
        <DS.OptionContent>
          <DS.TypeButton onClick={handleTypeToggle} type={type}>
            {GameRoomTypeMap[type]}
          </DS.TypeButton>
        </DS.OptionContent>
      </DS.gameCreateOption>
      <DS.gameCreateOption>
        <DS.gameCreateModalLabel>비밀번호</DS.gameCreateModalLabel>
        <DS.OptionContent>
          <DS.PasswordInput
            disabled={type !== "PROTECTED"}
            placeholder="비밀번호"
            value={password}
            onChange={onPasswordChange}
          />
        </DS.OptionContent>
      </DS.gameCreateOption>
      <DS.ButtonContainer>
        <IconButton title="취소" onClick={handleClose} theme="LIGHT" />
        <IconButton title="생성" onClick={onSubmit} theme="LIGHT" />
      </DS.ButtonContainer>
    </Modal>
  );
};
export default GameEditModal;
