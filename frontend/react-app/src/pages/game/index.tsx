import NavBar from "@src/components/common/navBar";
import { routeMatch, sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { gameAcceptUser, gameRoomInfoState } from "@src/recoil/atoms/game";
import { isConstructorDeclaration } from "typescript";

const Game = () => {
  const currentRoute = window.location.pathname;
  const [user] = useRecoilState(userDataState);
  const [gameUser] = useRecoilState(gameAcceptUser);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);

  console.log("currentRoute", currentRoute);
  const SideBarComponent = routeMatch(currentRoute, "/game/");

  console.log("user", user);
  console.log("gameUser", gameUser);
  console.log("gameRoomInfo", gameRoomInfo);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && <SideBarComponent />}
      <GameMatchProfile
        user={gameRoomInfo.homeUser}
        isReady={gameRoomInfo.homeReady}
      />
      <GameMatchProfile
        user={gameRoomInfo.awayUser}
        isReady={gameRoomInfo.awayReady}
      />
      {/* 상대방*/}
    </>
  );
};

export default Game;
