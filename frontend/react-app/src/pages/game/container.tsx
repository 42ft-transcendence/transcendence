// import React, { useEffect, useRef, useState } from "react";
import * as S from "./index.styled";
// import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import RankingIcon from "@assets/icons/ranking.svg";
import loseIcon from "@assets/icons/lose.svg";
import winIcon from "@assets/icons/win.svg";
import { UserType } from "@src/types";
import ReadyIcon from "@assets/icons/ready.svg";

interface GameMatchProfileProps {
  user: UserType;
  isReady: boolean;
}

export const GameMatchProfile = ({ user, isReady }: GameMatchProfileProps) => {
  return (
    <S.GameContainer>
      <S.GameMatchBox $isReady={isReady}>
        {isReady && <S.ReadyIcon src={ReadyIcon} />}
        <S.gameRoomProfileImg />
        {/* <S.UserCardStatus /> */}
        <S.gameRoomProfileNickname>{user.nickname}</S.gameRoomProfileNickname>
        <S.gameRoomProfileRank>
          <S.gameRoomProfileContainer>
            <S.gameRoomProfileRankImg src={RankingIcon} />
            <div>{user.rating}</div>
          </S.gameRoomProfileContainer>
          <S.gameRoomProfileContainer>
            <S.gameRoomProfileRankImg src={winIcon} />
            <div>{user.win}</div>
          </S.gameRoomProfileContainer>
          <S.gameRoomProfileContainer>
            <S.gameRoomProfileRankImg src={loseIcon} />
            <div>{user.lose}</div>
          </S.gameRoomProfileContainer>
        </S.gameRoomProfileRank>
      </S.GameMatchBox>
    </S.GameContainer>
  );
};
