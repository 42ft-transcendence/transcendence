// import React, { useEffect, useRef, useState } from "react";
import * as S from "./index.styled";
// import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import RankingIcon from "@assets/icons/ranking.svg";
import loseIcon from "@assets/icons/lose.svg";
import winIcon from "@assets/icons/win.svg";
import { UserType } from "@src/types";

// type gameMatchComponentProps = {
//   avatarPath: string;
//   status: number;
//   nickname: string;
//   rating: number;
// };

// export const UserCardComponent: React.
// const GameMatchProfilebox: React.FC<gameMatchComponentProps> = ({
//   avatarPath,
//   // status,
//   // nickname,
//   // rating,
// }) => {
//   return (
//     <S.GameContainer>
//       <S.UserCardImg src={avatarPath} />;
//     </S.GameContainer>
//   );
// };

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

// export const GameMatchWaiting = () => {
//   return (
//     <S.GameContainer>
//       <GameMatchProfile />
//       <GameMatchProfile />
//     </S.GameContainer>
//   );
// };
