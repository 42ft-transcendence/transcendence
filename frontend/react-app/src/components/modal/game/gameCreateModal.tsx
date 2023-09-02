import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { IconButton } from "@components/buttons";
import React, { useState } from "react";
import sha256 from "crypto-js/sha256";
import { userDataState } from "@src/recoil/atoms/common";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState } from "@src/recoil/atoms/game";

const hashTitle = (title: string): string => {
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

const GameCreateModal = () => {
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );
  const [user] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [speed, setSpeed] = useState("normal");
  const [type, setType] = useState<string>("PUBLIC");
  const [password, setPassword] = useState<string>("");
  const [isOpened, setIsOpened] = useRecoilState(createGameRoomModalState);
  const navigate = useNavigate();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameRoomInfo((prev) => ({
      ...prev,
      roomName: event.target.value,
    }));
  };

  const onSubmit = () => {
    const currentTime: Date = new Date();
    const roomURL = currentTime + gameRoomInfo.roomName + user.id;
    const hashedTitle = hashTitle(roomURL);
    console.log("gameRoomSubmit");
    console.log(hashedTitle);
    handleClose();
    navigate(`/game/${hashedTitle}`);
  };

  const handleClose = () => {
    setIsOpened(false);
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
  };

  if (isOpened === false) {
    return null;
  }

  return (
    <Modal
      isOpen={createGameRoom}
      onRequestClose={() => setCreateGameRoom(false)}
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
        <S.GameSpeedButton
          $selected={speed === "slow"}
          onClick={() => setSpeed("slow")}
        >
          느리게
        </S.GameSpeedButton>
        <S.GameSpeedButton
          $selected={speed === "normal"}
          onClick={() => setSpeed("normal")}
        >
          보통
        </S.GameSpeedButton>
        <S.GameSpeedButton
          $selected={speed === "fast"}
          onClick={() => setSpeed("fast")}
        >
          빠르게
        </S.GameSpeedButton>
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
