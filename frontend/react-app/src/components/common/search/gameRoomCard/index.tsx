import { GameRoomInfoType } from "@src/types";
import React from "react";
import * as S from "./index.styled";
import { GameRoomStatus } from "@src/types/game.type";
import ProtectedIcon from "@src/assets/icons/LockKey.svg";

export interface GameRoomCardProps {
  gameRoom: GameRoomInfoType;
  handleOnClick: (props: GameRoomInfoType) => void;
}

const GameRoomCard: React.FC<GameRoomCardProps> = ({
  gameRoom,
  handleOnClick,
}) => (
  <S.GameRoomCard
    key={gameRoom.roomURL}
    $status={gameRoom.status === GameRoomStatus.WAITING ? "대기중" : "게임중"}
    onClick={() => {
      if (gameRoom.status === GameRoomStatus.GAMING) return;
      handleOnClick(gameRoom);
    }}
  >
    <S.GameRoomCardLeft>
      <S.GameRoomTitle>
        {gameRoom.roomName !== "" ? gameRoom.roomName : "빠른 대전"}
      </S.GameRoomTitle>
      <S.GameRoomOption>
        {gameRoom.map} | {gameRoom.gameMode} | {gameRoom.roomOwner.nickname}
      </S.GameRoomOption>
    </S.GameRoomCardLeft>
    <S.GameRoomCardRight>
      <S.GameRoomCardRightTop>
        {gameRoom.roomType === "PROTECTED" ? (
          <S.GameRoomCardProtectedIcon
            src={ProtectedIcon}
          ></S.GameRoomCardProtectedIcon>
        ) : (
          <span />
        )}
        <S.GameRoomNumOfPeople>
          {gameRoom.numberOfParticipants} / 2
        </S.GameRoomNumOfPeople>
      </S.GameRoomCardRightTop>
      <S.GameRoomStatus>
        {gameRoom.status === GameRoomStatus.WAITING ? "대기중" : "게임중"}
      </S.GameRoomStatus>
    </S.GameRoomCardRight>
  </S.GameRoomCard>
);

export default GameRoomCard;
