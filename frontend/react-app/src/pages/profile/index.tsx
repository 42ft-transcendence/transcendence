import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import { matchHistoryState } from "@src/recoil/atoms/game";
import { useRecoilState } from "recoil";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { MatchCard, MatchHeader } from "./container";
import { matchHistoryListState } from "@src/recoil/atoms/common/game";
import { useEffect, useState } from "react";
import { MatchHistoryType } from "@src/types/game.type";
import { allUserListState, userDataState } from "@src/recoil/atoms/common";
import { UserType } from "@src/types";

const Profile = () => {
  const currentRoute = window.location.pathname;
  const [matchHistory] = useRecoilState(matchHistoryState);
  console.log("currentRoute", currentRoute);
  const SidebarComponent = routeMatch(currentRoute, "/profile/");
  const userId = currentRoute.split("/").pop() as string;
  const [userData] = useRecoilState(userDataState);
  const [userList] = useRecoilState(allUserListState);
  const [sortState, setSortState] = useState<string>("모드 전체");
  const sortMatchHistory = [...matchHistory].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }); // 최신순으로 정렬
  const [filteredHistoryList, setFilteredHistoryList] =
    useState<MatchHistoryType[]>(sortMatchHistory);
  const [search, setSearch] = useState<string>("");

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

  useEffect(() => {
    if (search === "") {
      setFilteredHistoryList(sortMatchHistory);
    } else {
      setFilteredHistoryList((prev) =>
        [...prev].filter(
          (history) =>
            history.player2.nickname.includes(search) ||
            history.player1.nickname.includes(search),
        ),
      );
    }
  }, [search]);

  const user = userList.find((user) => user.id === userId) as UserType;
  if (typeof user === "undefined") {
    window.location.href = "/profile/" + userData.id;
    return <></>;
  }

  if (!matchHistory || !SidebarComponent) return <></>; // TODO: 로딩 컴포넌트 추가

  return (
    <>
      <NavBar />
      <SidebarComponent user={user} />
      <DS.ContentArea>
        <MatchHeader
          userId={userId}
          historyList={filteredHistoryList.filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          )}
          sortState={sortState}
          setSortState={setSortState}
          search={search}
          setSearch={setSearch}
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
