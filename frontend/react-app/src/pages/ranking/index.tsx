import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";

const Ranking = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <DS.ContentArea>
        <S.ToolBarContainer>
          <S.TierContainer>TierContainer</S.TierContainer>
          <div>toolBar area</div>
          <S.SearchContainer>SearchContainer</S.SearchContainer>
        </S.ToolBarContainer>
        <S.RankingContainer>Ranking</S.RankingContainer>
      </DS.ContentArea>
    </>
  );
};

export default Ranking;
