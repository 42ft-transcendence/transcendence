import React, { useEffect, useRef, useState } from "react";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import RankingIcon from "@assets/icons/ranking.svg";

type SearchComponentProps = {
  search: string;
  setSearch: (value: string) => void;
  sortState: string;
  setSortState: (value: string) => void;
};

type UserCardComponentProps = {
  avatarPath: string;
  status: number;
  nickname: string;
  rating: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export const SearchComponent: React.FC<SearchComponentProps> = ({
  search,
  setSearch,
  sortState,
  setSortState,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortSelection = (selectedSort: string) => {
    setSortState(selectedSort);
    setShowDropdown(false);
    setTimeout(() => {
      setIsOpenDropdown(false);
    }, 0); // 0ms 지연으로 다음 리렌더링 사이클에서 호출되도록 설정
  };

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
      <S.SortContainer
        onClick={() => {
          setShowDropdown(!showDropdown);
          setIsOpenDropdown(true);
        }}
      >
        {showDropdown && (
          <S.SortDropdown ref={dropdownRef}>
            <S.SortOption onClick={() => handleSortSelection("닉네임 순")}>
              닉네임 순
            </S.SortOption>
            <S.SortOption onClick={() => handleSortSelection("랭크 점수 순")}>
              랭크 점수 순
            </S.SortOption>
          </S.SortDropdown>
        )}
        <span style={{ cursor: "pointer" }}>{sortState}</span>
        <S.SortArrowIcon $isOpen={isOpenDropdown} />
      </S.SortContainer>
    </S.SearchBarContainer>
  );
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
      <S.UserCardRank>
        <S.UserCardRankContainer>
          <S.UserCardRankImg src={RankingIcon} />
          <div>{rating}</div>
        </S.UserCardRankContainer>
      </S.UserCardRank>
    </S.UserCard>
  );
};
