import SearchBar from "@components/common/searchBar";
import * as S from "./index.styled";

export interface SearchListPropsType {
  onSearch: (searchText: string) => void;
  children?: React.ReactNode;
}

const SearchList = ({ onSearch, children }: SearchListPropsType) => {
  return (
    <S.Container>
      <SearchBar onSearch={onSearch} />
      <S.List>{children}</S.List>
    </S.Container>
  );
};

export default SearchList;
