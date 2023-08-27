import React from "react";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import RankingIcon from "@assets/icons/ranking.svg";

type SearchComponentProps = {
  search: string;
  setSearch: (value: string) => void;
};

type UserCardComponentProps = {
  avatarPath: string;
  status: number;
  nickname: string;
  rating: number;
};

export const SearchComponent: React.FC<SearchComponentProps> = ({
  search,
  setSearch,
}) => {
  return (
    <S.SearchBarContainer>
      <S.SearchBar>
        <S.SearchBarInput
          type="text"
          placeholder="유저 닉네임 검색"
          maxLength={10}
          id="nickname"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <S.SearchBarImg src={SearchIcon} />
      </S.SearchBar>
    </S.SearchBarContainer>
  );
};

export const UserCardComponent: React.FC<UserCardComponentProps> = ({
  avatarPath,
  status,
  nickname,
  rating,
}) => {
  return (
    <S.UserCard>
      <S.UserCardImg src={avatarPath} />
      <S.UserCardStatus $status={status} />
      <S.UserCardNickname>{nickname}</S.UserCardNickname>
      <S.UserCardRank>
        <S.UserCardRankContainer>
          <S.UserCardRankImg src={RankingIcon} />
          <div>{rating}</div>
        </S.UserCardRankContainer>
      </S.UserCardRank>
    </S.UserCard>
  );
};
