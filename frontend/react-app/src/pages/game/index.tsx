import NavBar from "@src/components/common/navBar";
import * as S from "./index.styled";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameChattingContainer, GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { userDataState } from "@src/recoil/atoms/common";
import React from "react";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [isGameStart, setIsGameStart] = React.useState(false);

  function areBothUsersReady() {
    if (typeof gameRoomInfo.participants === "undefined") {
      return false;
    }

    // 모든 사용자가 레디 상태인지 확인합니다.
    const allUsersReady = gameRoomInfo.participants.every((user) => user.ready);

    if (allUsersReady && !isGameStart) {
      setIsGameStart(true);
      // setGameRoomURL(gameRoomInfo.gameRoomURL);
    }
    return allUsersReady;
  }

  function startGameTest() {
    gameSocket.emit("startGameTest", {
      gameRoomURL: gameRoomURL,
    });
  }

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
      {/* 모달이 true일 때 열리기  */}
      {areBothUsersReady() && isGameStart && startGameTest()}{" "}
      {/* areBothUsersReady()가 참이고 isGameStart가 참일 때만 startGameTest 호출 */}
      {/* 버튼을 눌러서 isGameStart 값을 변경하도록 하는 코드를 추가해야 합니다 */}
      {isGameStart ? null : (
        <button onClick={() => setIsGameStart(true)}></button>
      )}
    </>
  );
};

export default Game;
