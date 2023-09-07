import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { IconButton } from "@components/buttons";
import React, { useEffect, useState } from "react";
import { GameRoomType } from "@src/types";
import { gameSocket } from "@src/router/socket/gameSocket";
import {
  gameRoomChatListState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";

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

const GameCreateModal = () => {
  const [createGameRoomModal, setCreateGameRoomModal] = useRecoilState(
    createGameRoomModalState,
  );
  const [speed, setSpeed] = useState("NORMAL");
  const [type, setType] = useState<string>("PUBLIC");
  const [roomName, setRoomName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: gameRoomURL,
      infoType: "roomName",
      info: event.target.value,
    });
  };

  const onSubmit = async () => {
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: gameRoomURL,
      infoType: "roomType",
      info: type as GameRoomType,
    });
    setType("PUBLIC");
    setSpeed("NORMAL");
    setRoomName("");
    setCreateGameRoomModal(false);
    setGameRoomChatList([]);
    window.location.href = `/game/${gameRoomURL}`;
  };

  const handleClose = () => {
    setType("PUBLIC");
    setSpeed("NORMAL");
    setRoomName("");
    gameSocket.emit("deleteGameRoom", { gameRoomURL: gameRoomURL });
    setGameRoomURL("");
    setCreateGameRoomModal(false);
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
    if (createGameRoomModal) {
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: gameRoomURL,
        infoType: "gameMode",
        info: speed,
      });
    }
  }, [speed]);

  return (
    <Modal
      isOpen={createGameRoomModal}
      style={{
        content: { ...S.ModalContent }, // Spread 연산자 사용
        overlay: { ...S.ModalOverlay }, // Spread 연산자 사용
      }}
    >
      <S.InputBoxWrapper
        type="text"
        placeholder="방 제목"
        id="nickname"
        value={roomName}
        onChange={handleTitleChange}
        maxLength={23}
      />
      <S.GameSpeedButtons>
        <S.gameCreateModalLabel>속도</S.gameCreateModalLabel>
        {SPEED_OPTIONS.map((option) => (
          <S.GameSpeedButton
            key={option.key}
            $selected={speed === option.key}
            onClick={() => setSpeed(option.key)}
          >
            {option.label}
          </S.GameSpeedButton>
        ))}
      </S.GameSpeedButtons>
      <S.gameCreateOption>
        <S.gameCreateModalLabel>맵 선택</S.gameCreateModalLabel>
        <S.mapbox />
      </S.gameCreateOption>
      <S.gameCreateOption>
        <S.gameCreateModalLabel>채널 유형</S.gameCreateModalLabel>
        <S.OptionContent>
          <S.TypeButton onClick={handleTypeToggle} type={type}>
            {GameRoomTypeMap[type]}
          </S.TypeButton>
        </S.OptionContent>
      </S.gameCreateOption>
      <S.gameCreateOption>
        <S.gameCreateModalLabel>비밀번호</S.gameCreateModalLabel>
        <S.OptionContent>
          <S.PasswordInput
            type="password"
            disabled={type !== "PROTECTED"}
            placeholder="비밀번호"
            value={password}
            onChange={onPasswordChange}
          />
        </S.OptionContent>
      </S.gameCreateOption>
      <S.ButtonContainer>
        <IconButton title="취소" onClick={handleClose} theme="LIGHT" />
        <IconButton title="생성" onClick={onSubmit} theme="LIGHT" />
      </S.ButtonContainer>
    </Modal>
  );
};
export default GameCreateModal;
