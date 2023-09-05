import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameListContent } from "./container";

const GameList = () => {
  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <GameListContent />
      {/* 모달 영역 */}
      <GameCreateModal />
    </>
  );
};

export default GameList;
