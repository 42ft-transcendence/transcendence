import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";

const GameList = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <GameCreateModal />
    </>
  );
};

export default GameList;
