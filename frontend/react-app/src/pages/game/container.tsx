// import React, { useEffect, useRef, useState } from "react";
import * as S from "./index.styled";
// import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import RankingIcon from "@assets/icons/ranking.svg";
import loseIcon from "@assets/icons/lose.svg";
import winIcon from "@assets/icons/win.svg";
import { UserType } from "@src/types";

interface GameMatchProfileProps {
  user: UserType;
}

export const GameMatchProfile = ({ user }: GameMatchProfileProps) => {
  return (
    <S.GameContainer>
      <S.GameMatchBox>
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
