import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { useEffect } from "react";
import { gameAlertModalState } from "@src/recoil/atoms/modal";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);

  useEffect(() => {
    if (gameRoomInfo.gameType === "QUICK" && !gameRoomInfo.awayUser.id) {
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
      <GameMatchProfile
        user={gameRoomInfo.homeUser}
        isReady={gameRoomInfo.homeReady}
      />
      {gameRoomInfo.awayUser.id && (
        <GameMatchProfile
          user={gameRoomInfo.awayUser}
          isReady={gameRoomInfo.awayReady}
        />
      )}
    </>
  );
};

export default Game;
