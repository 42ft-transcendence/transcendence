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
  const gameRoomList = useRecoilState(gameRoomListState);

  useEffect(() => {
    gameSocket.emit("getGameRoomInfo");
    setGameRoomInfo(
      gameRoomList[0].find(
        (room) => room.roomURL === userData.gameRoomURL,
      ) as GameRoomInfoType,
    );
  }, []);

  useEffect(() => {
    if (
      gameRoomInfo.roomType === "QUICK" &&
      (!gameRoomInfo.awayUser.id || !gameRoomInfo.homeUser.id)
    ) {
      console.log("here");
      setGameAlertModal({
        gameAlertModal: true,
        gameAlertModalMessage: "상대방이 나갔습니다.",
        shouldRedirect: true,
        shouldInitInfo: true,
      });
    }
  }, [gameRoomInfo.awayUser.id]);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && <SideBarComponent />}
      {gameRoomInfo.homeUser.id ? (
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
      )}
    </>
  );
};

export default Game;
