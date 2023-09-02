import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { IconButton } from "@components/buttons";
import React, { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";
import { userDataState } from "@src/recoil/atoms/common";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { GameRoomType, UserType } from "@src/types";
import { createGameRoom } from "@src/api/game";

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
  { key: "slow", label: "느리게" },
  { key: "normal", label: "보통" },
  { key: "fast", label: "빠르게" },
];

const GameCreateModal = () => {
  const [createGameRoomModal, setCreateGameRoomModal] = useRecoilState(
    createGameRoomModalState,
  );
  const [user] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [speed, setSpeed] = useState("normal");
  const [type, setType] = useState<string>("PUBLIC");
  const [password, setPassword] = useState<string>("");
  const [created, setCreated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("gameRoomInfo", gameRoomInfo);
  }, [gameRoomInfo]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTime: Date = new Date();
    const roomURL = currentTime + event.target.value + user.id;
    setGameRoomInfo((prev) => ({
      ...prev,
      roomURL: stringToHash(roomURL),
      roomName: event.target.value,
    }));
  };

  const onSubmit = async () => {
    await createGameRoom(gameRoomInfo);
    setCreated(true);
    handleClose();
    navigate(`/game/${gameRoomInfo.roomURL}`);
  };

  const handleClose = () => {
    setType("PUBLIC");
    if (!created) {
      setGameRoomInfo({
        roomURL: "",
        roomName: "",
        roomType: "",
        roomPassword: "",
        homeUser: {} as UserType,
        awayUser: {} as UserType,
        homeReady: false,
        awayReady: false,
      });
    }
    setCreateGameRoomModal(false);
  };

  const handleTypeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (type === "PUBLIC") {
      setType("PROTECTED");
      setGameRoomInfo((prev) => ({
        ...prev,
        roomType: "PROTECTED" as GameRoomType,
      }));
    } else if (type === "PROTECTED") {
      setType("PRIVATE");
      setGameRoomInfo((prev) => ({
        ...prev,
        roomType: "PRIVATE" as GameRoomType,
      }));
    } else {
      setType("PUBLIC");
      setGameRoomInfo((prev) => ({
        ...prev,
        roomType: "PUBRIC" as GameRoomType,
      }));
    }
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setGameRoomInfo((prev) => ({
      ...prev,
      roomPassword: stringToHash(event.target.value),
    }));
  };

  return (
    <Modal
      isOpen={createGameRoomModal}
      onRequestClose={() => setCreateGameRoomModal(false)}
      style={{
        content: { ...S.ModalContent }, // Spread 연산자 사용
        overlay: { ...S.ModalOverlay }, // Spread 연산자 사용
      }}
    >
      <S.InputBoxWrapper
        type="text"
        placeholder="방 제목"
        id="nickname"
        value={gameRoomInfo.roomName}
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
