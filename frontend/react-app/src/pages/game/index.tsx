import NavBar from "@src/components/common/navBar";
import { routeMatch, sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { gameAcceptUser } from "@src/recoil/atoms/game";

const Game = () => {
  const currentRoute = window.location.pathname;
  const [user] = useRecoilState(userDataState);
  const [gameUser] = useRecoilState(gameAcceptUser);

  console.log("currentRoute", currentRoute);
  const SideBarComponent = routeMatch(currentRoute, "/game/");

  console.log("user", user);
  console.log("gameUser", gameUser);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && <SideBarComponent />}
      <GameMatchProfile user={user} />
      <GameMatchProfile user={gameUser.user} />
      {/* 상대방*/}
    </>
  );
};

export default Game;
