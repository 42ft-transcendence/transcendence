import NavBar from "@src/components/common/navBar";
import { profileRouteMatch } from "@src/components/common/sideBar";
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
  const userId = currentRoute.split("/").pop() as string;
  const [userData] = useRecoilState(userDataState);
  const [userList] = useRecoilState(allUserListState);
  const SidebarComponent = profileRouteMatch(currentRoute);
  const [matchHistory] = useRecoilState(matchHistoryListState);
  const [sortState, setSortState] = useState<string>("모드 전체");
  const sortMatchHistory = [...matchHistory].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }); // 최신순으로 정렬
  const [filteredHistoryList, setFilteredHistoryList] =
    useState<MatchHistoryType[]>(sortMatchHistory);
  const [search, setSearch] = useState<string>("");
  const [moreInfo, setMoreInfo] = useState<number>(20);

  useEffect(() => {
    if (sortState === "랭크") {
      setFilteredHistoryList(
        sortMatchHistory
          .filter((history) => history.gameMode === "rank")
          .filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          ),
      );
    } else if (sortState === "일반") {
      setFilteredHistoryList(
        sortMatchHistory
          .filter((history) => history.gameMode === "normal")
          .filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          ),
      );
    } else {
      setFilteredHistoryList(
        sortMatchHistory.filter(
          (history) =>
            history.player1.id === userId || history.player2.id === userId,
        ),
      );
    }
    setMoreInfo(20);
  }, [sortState]);

  useEffect(() => {
    if (search === "") {
      setFilteredHistoryList(
        sortMatchHistory.filter(
          (history) =>
            history.player1.id === userId || history.player2.id === userId,
        ),
      );
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
          historyList={filteredHistoryList}
          sortState={sortState}
          setSortState={setSortState}
          search={search}
          setSearch={setSearch}
        />
        <S.MatchContainer>
          {filteredHistoryList.slice(0, moreInfo).map((match) => (
            <MatchCard history={match} key={match.id}></MatchCard>
          ))}
          {moreInfo < filteredHistoryList.length && (
            <S.MoreInfoButton onClick={() => setMoreInfo((prev) => prev + 20)}>
              더보기
            </S.MoreInfoButton>
          )}
        </S.MatchContainer>
      </DS.ContentArea>
    </>
  );
};

export default Profile;
