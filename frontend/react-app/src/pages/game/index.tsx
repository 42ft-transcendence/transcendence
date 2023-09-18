import NavBar from "@src/components/common/navBar";
import * as S from "./index.styled";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameChattingContainer, GameMatchProfile } from "./container";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameRoomInfoState, gameRoomListState } from "@src/recoil/atoms/game";
import { userDataState } from "@src/recoil/atoms/common";
import React, { useEffect } from "react";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL] = useRecoilState(gameRoomURLState);
  const gameRoomList = useRecoilValue(gameRoomListState);

  useEffect(() => {
    const info = gameRoomList.find((room) => room.roomURL === gameRoomURL);
    if (!info) return;
    setGameRoomInfo(info);
  });

  useEffect(() => {
    if (typeof gameRoomInfo.participants === "undefined") return;
    if (gameRoomInfo.roomOwner.id !== userData.id) return;

    // 모든 사용자가 레디 상태인지 확인합니다.
    const allUsersReady =
      gameRoomInfo.participants.length === 2 &&
      gameRoomInfo.participants.every((user) => user.ready);
    console.log("allUsersReady", allUsersReady);
    if (allUsersReady) {
      gameSocket.emit("startGameCountDown", {
        gameRoomURL: gameRoomURL,
      });
    }
  }, [gameRoomInfo.participants]);

  useEffect(() => {
    if (currentRoute.split("/").pop() !== gameRoomURL && gameRoomURL === "") {
      window.location.href = "/game-list";
      return;
    } else if (
      currentRoute.split("/").pop() !== gameRoomURL &&
      gameRoomURL !== ""
    ) {
      window.location.href = `/game/${gameRoomURL}`;
      return;
    }
    if (gameRoomInfo.roomType !== "RANKING") return;
    if (gameRoomInfo.roomOwner.id !== userData.id) return;
    gameSocket.emit("startGameCountDown", {
      gameRoomURL: gameRoomURL,
    });
  });

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
