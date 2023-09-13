import SearchBar, {
  SearchBarPropsType,
} from "@src/components/common/search/searchBar";
import * as S from "./index.styled";

export interface SearchListPropsType {
  searchBar: SearchBarPropsType;
  children?: React.ReactNode;
}

const SearchList = ({ searchBar, children }: SearchListPropsType) => {
  return (
    <S.Container>
      <SearchBar
        id={searchBar.id}
        search={searchBar.search}
        setSearch={searchBar.setSearch}
        sortState={searchBar.sortState}
        setSortState={searchBar.setSortState}
        sortOptions={searchBar.sortOptions}
        placeholder={searchBar.placeholder}
      />
      <S.List>{children}</S.List>
    </S.Container>
  );
};

export default SearchList;
