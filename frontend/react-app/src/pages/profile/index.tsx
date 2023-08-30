import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import { matchHistoryState } from "@src/recoil/atoms/game";
import { useRecoilState } from "recoil";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { MatchCard } from "./container";

const Profile = () => {
  const currentRoute = window.location.pathname;
  const [matchHistory] = useRecoilState(matchHistoryState);

  console.log("currentRoute", currentRoute);
  const SidebarComponent = routeMatch(currentRoute, "/profile/");

  console.log("matchHistory", matchHistory);

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
      <DS.ContentArea>
        <S.Header>Header</S.Header>
        <S.MatchContainer>
          <p>MatchContainer</p>
          <MatchCard mode={"win"}></MatchCard>
          <S.MatchCard mode={"lose"}>lose</S.MatchCard>
        </S.MatchContainer>
      </DS.ContentArea>
    </>
  );
};

export default Profile;
