import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { useState } from "react";

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
              <S.Record>
                {user.ladder_win}W / {user.ladder_lose}L
              </S.Record>
            </S.UserCard>
          ))}
        </S.RankingContainer>
      </DS.ContentArea>
    </>
  );
};

export default Ranking;
