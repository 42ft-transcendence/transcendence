import { userDataState } from "@src/recoil/atoms/common";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import {
  battleActionModalState,
  gameAlertModalState,
} from "@src/recoil/atoms/modal";
import { gameSocket, gameSocketConnect } from "@src/router/socket/gameSocket";
import { OfferGameType, UserType } from "@src/types";
import { GameRoomType } from "@src/types/game.type";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const useGameSocket = (jwt: string) => {
  const setBattleActionModal = useSetRecoilState(battleActionModalState);
  const [user] = useRecoilState(userDataState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);

  useEffect(() => {
    if (!jwt) {
      gameSocket.disconnect();
    } else {
      gameSocket.off("offerBattle");
      gameSocket.on("offerBattle", (data: OfferGameType) => {
        setBattleActionModal({
          battleActionModal: user.id === data.myData.id,
          awayUser: data.awayUser,
          gameRoomURL: data.gameRoomURL,
          gameType: data.gameType as GameRoomType,
        });
      });

      gameSocket.off("acceptBattle");
      gameSocket.on("acceptBattle", (data) => {
        if (user.id === data.myData.id) {
          window.location.href = `/game/${data.gameRoomURL}`;
        }
      });

      gameSocket.off("rejectBattle");
      gameSocket.on("rejectBattle", (data) => {
        console.log("rejectBattle", data);
        if (user.id === data.myData.id) {
          console.log("here");
          setGameAlertModal({
            gameAlertModal: true,
            gameAlertModalMessage: "상대방이 대전 신청을 거절했습니다.",
            shouldRedirect: false,
            shouldInitInfo: true,
          });
        }
      });

      gameSocket.off("readySignal");
      gameSocket.on("readySignal", (data) => {
        if (
          gameRoomInfo.roomURL === data.gameRoomURL &&
          gameRoomInfo.awayUser.id === data.awayUser.id
        ) {
          setGameRoomInfo({
            ...gameRoomInfo,
            awayReady: data.isReady,
          });
        }
      });

      gameSocket.off("exitGameRoom");
      gameSocket.on("exitGameRoom", (data) => {
        if (
          gameRoomInfo.roomURL === data.gameRoomURL &&
          gameRoomInfo.awayUser.id === data.awayUser.id
        ) {
          setGameRoomInfo({
            ...gameRoomInfo,
            awayUser: {} as UserType,
          });
        }
      });

      gameSocketConnect(jwt);
    }

    return () => {
      // 소켓 이벤트 해제 로직 (cleanup function)
      gameSocket.off("offerBattle");
      gameSocket.off("acceptBattle");
      gameSocket.off("rejectBattle");
      gameSocket.off("readySignal");
      gameSocket.off("exitGameRoom");
      // ... (다른 gameSocket 이벤트 해제 로직)
    };
  }, [jwt]); // 의존성 배열에 필요한 값들을 넣어주세요.
};

export default useGameSocket;
