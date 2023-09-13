import React from "react";
import * as S from "./index.styled";

type UserCardComponentProps = {
  avatarPath: string;
  status: number;
  nickname: string;
  rating: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export const UserCardComponent: React.FC<UserCardComponentProps> = ({
  avatarPath,
  status,
  nickname,
  rating,
  onClick,
}) => {
  return (
    <S.UserCard onClick={onClick}>
      <S.UserCardImg src={avatarPath} />
      <S.UserCardStatus $status={status} />
      <S.UserCardNickname>{nickname}</S.UserCardNickname>
      <S.UserCardRank>{rating}</S.UserCardRank>
    </S.UserCard>
  );
};
