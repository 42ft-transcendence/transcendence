import { useState } from "react";
import * as S from "./index.styled";

export interface SearchBarPropsType {
  onSearch: (searchText: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarPropsType) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchText);
    setSearchText("");
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Input value={searchText} onChange={handleInputChange} />
      <S.Button type="submit" />
    </S.Form>
  );
};

export default SearchBar;
