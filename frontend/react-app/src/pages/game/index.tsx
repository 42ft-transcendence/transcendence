import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { gameAlertModalState } from "@src/recoil/atoms/modal";
import { userDataState } from "@src/recoil/atoms/common";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);

  function areBothUsersReady() {
    if (typeof gameRoomInfo.participants === "undefined") {
      return false;
    }

    // 모든 사용자가 레디 상태인지 확인합니다.
    const allUsersReady = gameRoomInfo.participants.every((user) => user.ready);
    console.log("allUsersReady", allUsersReady);
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
      {typeof gameRoomInfo.participants !== "undefined" &&
        gameRoomInfo.participants.map((user) => (
          <GameMatchProfile
            key={user.user.id}
            user={user.user}
            isReady={user.ready}
          />
        ))}
      {areBothUsersReady() && startGameTest()}
    </>
  );
};

export default Game;
