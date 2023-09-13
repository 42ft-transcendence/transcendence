import React, { useState } from "react";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import { SortDropdownComponent } from "@src/components/dropdown";

export type SearchBarPropsType = {
  id: string;
  search: string;
  setSearch: (value: string) => void;
  sortState: string;
  setSortState: (value: string) => void;
  sortOptions: string[];
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarPropsType> = ({
  id,
  search,
  setSearch,
  sortState,
  setSortState,
  sortOptions,
  placeholder,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  return (
    <S.SearchBarContainer>
      <S.SearchBar>
        <S.SearchBarInput
          type="text"
          placeholder={placeholder || "닉네임을 입력하세요"}
          maxLength={10}
          id={id}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <S.SearchBarImg src={SearchIcon} />
      </S.SearchBar>
      <SortDropdownComponent
        sortState={sortState}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        setSortState={setSortState}
        setIsOpenDropdown={setIsOpenDropdown}
        options={sortOptions}
        isOpenDropdown={isOpenDropdown}
        mode="LIGHT"
      />
    </S.SearchBarContainer>
  );
};

export default SearchBar;
