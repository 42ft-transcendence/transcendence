import NavBar from "@src/components/common/navBar";
import * as S from "./index.styled";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameChattingContainer, GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { userDataState } from "@src/recoil/atoms/common";
import React from "react";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && (
        <SideBarComponent
          isReady={
            gameRoomInfo.participants.find(
              (participant) => participant.user.id === userData.id,
            )?.ready
          }
        />
      )}
      <S.GameContainer>
        <S.GameProfileContainer>
          {typeof gameRoomInfo.participants !== "undefined" &&
            gameRoomInfo.participants.map((user, index: number) => (
              <React.Fragment key={user.user.id}>
                <GameMatchProfile user={user.user} isReady={user.ready} />
                {index === 0 && <S.VsIcon>VS</S.VsIcon>}
                {gameRoomInfo.participants.length === 1 && (
                  <S.GameWaitingBox>대기중</S.GameWaitingBox>
                )}
              </React.Fragment>
            ))}
        </S.GameProfileContainer>
        <GameChattingContainer />
      </S.GameContainer>
    </>
  );
};

export default Game;
