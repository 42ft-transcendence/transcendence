import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { useState } from "react";

const calculateWinRate = (wins: number, losses: number) => {
  const totalGames = wins + losses;
  if (totalGames === 0) return "0";
  return ((wins / totalGames) * 100).toFixed(2);
};

const Ranking = () => {
  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  const [userList] = useRecoilState(allUserListState);
  const [sortedUserList] = useState(
    [...userList].sort((a, b) => b.rating - a.rating),
  );

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
        <S.HeaderCard>
          <S.Rank style={{ marginLeft: "20px" }}>#</S.Rank>
          <S.ProfileImage style={{ opacity: 0 }} />
          <S.Nickname>닉네임</S.Nickname>
          <S.Tier>점수</S.Tier>
          {/* <S.Record>승패</S.Record> */}
          <S.WinRate
            style={{
              width: "200px",
              textAlign: "center",
              marginRight: "10px",
            }}
          >
            승률
          </S.WinRate>
        </S.HeaderCard>
        <S.RankingContainer>
          {sortedUserList.map((user, index) => (
            <S.UserCard key={user.id}>
              <S.Rank>{index + 1}</S.Rank>
              <S.ProfileImage src={user.avatarPath} alt={user.nickname} />
              <S.Nickname>{user.nickname}</S.Nickname>
              <S.Tier>
                {/* {user.tier}  */}
                {user.rating} LP
              </S.Tier>
              <S.WinRateContainer>
                <S.WinRateChart>
                  <S.WinBar
                    style={{
                      width: `${calculateWinRate(
                        user.ladder_win,
                        user.ladder_lose,
                      )}%`,
                    }}
                  >
                    <S.WinText>{user.ladder_win}</S.WinText>
                  </S.WinBar>
                  <S.LoseBar
                    style={{
                      width: `${
                        100 -
                        parseFloat(
                          calculateWinRate(user.ladder_win, user.ladder_lose),
                        )
                      }%`,
                    }}
                  >
                    <S.LoseText>{user.ladder_lose}</S.LoseText>
                  </S.LoseBar>
                </S.WinRateChart>
                <S.WinRate>
                  {calculateWinRate(user.ladder_win, user.ladder_lose)}%
                </S.WinRate>
              </S.WinRateContainer>
            </S.UserCard>
          ))}
        </S.RankingContainer>
      </DS.ContentArea>
    </>
  );
};

export default Ranking;
