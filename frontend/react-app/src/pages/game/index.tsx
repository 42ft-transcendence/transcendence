import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameRoomInfoState, gameRoomListState } from "@src/recoil/atoms/game";
import { useEffect } from "react";
import { gameAlertModalState } from "@src/recoil/atoms/modal";
import { gameSocket } from "@src/router/socket/gameSocket";
import { userDataState } from "@src/recoil/atoms/common";
import { GameRoomInfoType } from "@src/types";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && <SideBarComponent />}
      {typeof gameRoomInfo.participants !== "undefined" &&
        gameRoomInfo.participants.map((user) => (
          <GameMatchProfile
            key={user.user.id}
            user={user.user}
            isReady={user.ready}
          />
        ))}
      {/* {gameRoomInfo.homeUser.id ? (
        <GameMatchProfile
          user={gameRoomInfo.homeUser}
          isReady={gameRoomInfo.homeReady}
        />
      ) : (
        <>대기중</>
      )}
      {gameRoomInfo.awayUser.id ? (
        <GameMatchProfile
          user={gameRoomInfo.awayUser}
          isReady={gameRoomInfo.awayReady}
        />
      ) : (
        <>대기중</>
      )} */}
    </>
  );
};

export default Game;
