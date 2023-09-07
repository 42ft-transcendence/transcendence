import NavBar from "@src/components/common/navBar";
import * as S from "./index.styled";
import { routeMatch } from "@src/components/common/sideBar";
import GameCreateModal from "@src/components/modal/game/gameCreateModal";
import { GameChattingContainer, GameMatchProfile } from "./container";
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
      <S.GameContainer>
        <S.GameProfileContainer>
          {typeof gameRoomInfo.participants !== "undefined" &&
            gameRoomInfo.participants.map((user, index: number) => (
              <>
                <GameMatchProfile
                  key={user.user.id}
                  user={user.user}
                  isReady={user.ready}
                />
                {index === 0 && <S.VsIcon>VS</S.VsIcon>}
                {gameRoomInfo.participants.length === 1 && (
                  <S.GameWaitingBox>대기중</S.GameWaitingBox>
                )}
              </>
            ))}
        </S.GameProfileContainer>
        <GameChattingContainer />
      </S.GameContainer>
    </>
  );
};

export default Game;
