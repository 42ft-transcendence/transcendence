import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { IconButton } from "@components/buttons";
import React, { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";
import { userDataState } from "@src/recoil/atoms/common";
import { GameRoomType, UserType } from "@src/types";
import { gameSocket } from "@src/router/socket/gameSocket";

const stringToHash = (title: string): string => {
  const hash = sha256(title);
  return hash.toString(); // 해시 값을 문자열로 반환
};

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
  const [userData, setUserData] = useRecoilState(userDataState);
  const [speed, setSpeed] = useState("NORMAL");
  const [type, setType] = useState<string>("PUBLIC");
  const [roomName, setRoomName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: userData.gameRoomURL,
      infoType: "roomName",
      info: event.target.value,
    });
  };

  const onSubmit = async () => {
    handleClose();
    window.location.href = `/game/${userData.gameRoomURL}`;
  };

  const handleClose = () => {
    setType("PUBLIC");
    setSpeed("NORMAL");
    setRoomName("");
    console.log("deleteGameRoom", userData.gameRoomURL);
    gameSocket.emit("deleteGameRoom", { gameRoomURL: userData.gameRoomURL });
    setUserData({
      ...userData,
      gameRoomURL: "",
    });
    setCreateGameRoomModal(false);
  };

  const handleTypeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (type === "PUBLIC") {
      setType("PROTECTED");
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: userData.gameRoomURL,
        infoType: "roomType",
        info: "PROTECTED" as GameRoomType,
      });
    } else if (type === "PROTECTED") {
      setType("PRIVATE");
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: userData.gameRoomURL,
        infoType: "roomType",
        info: "PRIVATE" as GameRoomType,
      });
    } else {
      setType("PUBLIC");
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: userData.gameRoomURL,
        infoType: "roomType",
        info: "PUBLIC" as GameRoomType,
      });
    }
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    gameSocket.emit("editGameRoomInfo", {
      gameRoomURL: userData.gameRoomURL,
      infoType: "roomPassword",
      info: event.target.value,
    });
  };

  useEffect(() => {
    if (createGameRoomModal) {
      gameSocket.emit("editGameRoomInfo", {
        gameRoomURL: userData.gameRoomURL,
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
