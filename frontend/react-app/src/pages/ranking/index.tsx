import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { useState } from "react";
import { HeaderCard, UserCard } from "./container";

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
        {/* // TODO: ToolBarContainer
        <S.ToolBarContainer>
          <S.TierContainer>TierContainer</S.TierContainer>
          <div>toolBar area</div>
          <S.SearchContainer>SearchContainer</S.SearchContainer>
        </S.ToolBarContainer> */}
        <HeaderCard />
        <S.RankingContainer>
          {sortedUserList.map((user, index) => (
            <UserCard key={user.id} user={user} index={index} />
          ))}
        </S.RankingContainer>
      </DS.ContentArea>
    </>
  );
};

export default Ranking;
