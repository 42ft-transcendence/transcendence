import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";

const UserList = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <DS.ContentArea>
        <S.SearchBarContainer>
          <S.SearchBar>
            <S.SearchBarInput placeholder="유저 닉네임 검색" maxLength={10} />
            <S.SearchBarImg src={SearchIcon} />
          </S.SearchBar>
        </S.SearchBarContainer>
      </DS.ContentArea>
    </>
  );
};

export default UserList;
