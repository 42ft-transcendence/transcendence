import NavBar from "@src/components/common/navBar";
import { profileRouteMatch } from "@src/components/common/sideBar";
import { useRecoilState } from "recoil";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { MatchCard, MatchHeader } from "./container";
import { matchHistoryListState } from "@src/recoil/atoms/common/game";
import { useEffect, useState } from "react";
import { MatchHistoryType } from "@src/types/game.type";

const Profile = () => {
  const currentRoute = window.location.pathname;
  const SidebarComponent = profileRouteMatch(currentRoute);
  const userId = currentRoute.split("/").pop();
  const [matchHistory] = useRecoilState(matchHistoryListState);
  const [sortState, setSortState] = useState<string>("모드 전체");
  const sortMatchHistory = [...matchHistory].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }); // 최신순으로 정렬
  const [filteredHistoryList, setFilteredHistoryList] =
    useState<MatchHistoryType[]>(sortMatchHistory);

  useEffect(() => {
    if (sortState === "랭크") {
      setFilteredHistoryList(
        sortMatchHistory.filter((history) => history.gameMode === "rank"),
      );
    } else if (sortState === "일반") {
      setFilteredHistoryList(
        sortMatchHistory.filter((history) => history.gameMode === "normal"),
      );
    } else {
      setFilteredHistoryList(sortMatchHistory);
    }
  }, [sortState]);

  if (!matchHistory) return <></>; // TODO: 로딩 컴포넌트 추가

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
      <DS.ContentArea>
        <MatchHeader
          historyList={filteredHistoryList.filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          )}
          sortState={sortState}
          setSortState={setSortState}
        />
        <S.MatchContainer>
          {filteredHistoryList.map((match) => {
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
