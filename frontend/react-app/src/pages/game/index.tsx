import NavBar from "@src/components/common/navBar";
import { routeMatch, sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";

const Game = () => {
  const currentRoute = window.location.pathname;
  const [user] = useRecoilState(userDataState);

  console.log("currentRoute", currentRoute);
  const SideBarComponent = routeMatch(currentRoute, "/game/");

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && <SideBarComponent />}
      <GameMatchProfile user={user} />
      <GameMatchProfile user={user} />
      {/* 상대방*/}
    </>
  );
};

export default Game;
