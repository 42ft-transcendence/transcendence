import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameListContent } from "./container";
import { gameRoomListState } from "@src/recoil/atoms/game";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { gameSocket } from "@src/router/socket/gameSocket";

const GameList = () => {
  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;
  const gameRoomList = useRecoilState(gameRoomListState);

  useEffect(() => {
    gameSocket.emit("getGameRoomList");
  }, []);

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
