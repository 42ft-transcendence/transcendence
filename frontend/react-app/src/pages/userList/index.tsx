import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import { useEffect, useState } from "react";

const UserList = () => {
  const [search, setSearch] = useState<string>("");
  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;
  console.log("currentRoute", currentRoute);

  useEffect(() => {
    console.log("search", search);
  }, [search]);

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <DS.ContentArea>
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
      </DS.ContentArea>
    </>
  );
};

export default UserList;
