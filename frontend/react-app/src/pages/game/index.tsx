import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { gameAcceptUser, gameRoomInfoState } from "@src/recoil/atoms/game";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "@src/types";
import { gameAlertModalState } from "@src/recoil/atoms/modal";
import GameAlertModal from "@src/components/modal/game/gameAlertModal";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameAlertModal, setGameAlertModal] =
    useRecoilState(gameAlertModalState);

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
      {/* 모달 */}
      {gameAlertModal.gameAlertModal && <GameAlertModal />}
    </>
  );
};

export default Game;
