import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameMatchProfile } from "./container";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { gameAlertModalState } from "@src/recoil/atoms/modal";
import { userDataState } from "@src/recoil/atoms/common";

const Game = () => {
  const currentRoute = window.location.pathname;
  const SideBarComponent = routeMatch(currentRoute, "/game/");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);

  return (
    <>
      <NavBar />
      <GameCreateModal />
      {SideBarComponent && (
        <SideBarComponent
          isReady={
            gameRoomInfo.participants.find(
              (participant) => participant.user.id === userData.id,
            )?.ready
          }
        />
      )}
      {typeof gameRoomInfo.participants !== "undefined" &&
        gameRoomInfo.participants.map((user) => (
          <GameMatchProfile
            key={user.user.id}
            user={user.user}
            isReady={user.ready}
          />
        ))}
      {/* {gameRoomInfo.homeUser.id ? (
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
      )} */}
    </>
  );
};

export default Game;
