import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameListContent } from "./container";
import { useEffect, useState } from "react";
import { gameSocket } from "@src/router/socket/gameSocket";
import { GameRoomInfoType } from "@src/types";
import GameRoomEnterModal from "@src/components/modal/game/gameEnterModal";

const GameList = () => {
  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;
  const [selectGameRoom, setSelectGameRoom] = useState<GameRoomInfoType>();
  const [isOpenEnterModal, setIsOpenEnterModal] = useState<boolean>(false);

  useEffect(() => {
    gameSocket.emit("getGameRoomList");
    // gameSocket.on("rejectEnterRoom", () => {
    //   alert("인원이 가득 찼습니다.");
    //   return;
    // });
  }, []);

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
      <GameListContent
        setSelectGameRoom={setSelectGameRoom}
        setIsOpenEnterModal={setIsOpenEnterModal}
      />
      {/* 모달 영역 */}
      <GameCreateModal />
      {selectGameRoom && (
        <GameRoomEnterModal
          gameRoomInfo={selectGameRoom}
          setSelectGameRoom={setSelectGameRoom}
          isOpen={isOpenEnterModal}
          setIsOpen={setIsOpenEnterModal}
        />
      )}
    </>
  );
};

export default GameList;
