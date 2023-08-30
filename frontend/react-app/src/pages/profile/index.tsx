import NavBar from "@src/components/common/navBar";
import { profileRouteMatch } from "@src/components/common/sideBar";
import { useRecoilState } from "recoil";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { MatchCard } from "./container";
import { matchHistoryListState } from "@src/recoil/atoms/common/game";

const Profile = () => {
  const currentRoute = window.location.pathname;
  const userId = currentRoute.split("/").pop();
  const [matchHistory] = useRecoilState(matchHistoryListState);

  console.log("currentRoute", currentRoute);
  const SidebarComponent = profileRouteMatch(currentRoute);

  console.log("matchHistory", matchHistory);
  console.log("matchHistory[0]", matchHistory[0]);

  if (!matchHistory) return <></>; // TODO: 로딩 컴포넌트 추가

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
      <DS.ContentArea>
        <S.Header>Header</S.Header>
        <S.MatchContainer>
          {matchHistory.map((match) => {
            if (match.player1.id === userId || match.player2.id === userId) {
              return <MatchCard history={match} key={match.id}></MatchCard>;
            }
          })}
        </S.MatchContainer>
      </DS.ContentArea>
    </>
  );
};

export default Profile;
