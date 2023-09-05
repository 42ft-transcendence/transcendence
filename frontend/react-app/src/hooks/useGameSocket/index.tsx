import { userDataState } from "@src/recoil/atoms/common";
import {
  gameRoomInfoInitState,
  gameRoomInfoState,
  gameRoomListState,
} from "@src/recoil/atoms/game";
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
  const setGameRoomList = useSetRecoilState(gameRoomListState);

  useEffect(() => {
    if (!jwt) {
      gameSocket.disconnect();
      // setGameRoomInfo(gameRoomInfoInitState);
    } else {
      console.log("gamesocket connected");
      gameSocket.off("roomList");
      gameSocket.on("roomList", (data) => {
        console.log("roomList", data);
        setGameRoomList(data);
      });

      gameSocket.off("offerBattle");
      gameSocket.on("offerBattle", (data: OfferGameType) => {
        console.log("offerBattle socket", data);
        // setBattleActionModal({
        //   battleActionModal: user.id === data.awayUser.id,
        //   awayUser: data.myData,
        //   gameRoomURL: data.gameRoomURL,
        //   gameType: data.roomType as GameRoomType,
        // });
      });

      gameSocket.off("acceptBattle");
      gameSocket.on("acceptBattle", (data) => {
        if (user.id === data.awayUser.id) {
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
        if (gameRoomInfo.roomURL === data.gameRoomURL) {
          console.log(
            "readySignal",
            gameRoomInfo,
            data.awayUser.id,
            user.id,
            data.awayUser.id === user.id,
          );
          if (
            user.id !== data.awayUser.id &&
            gameRoomInfo.awayUser.id === data.awayUser.id
          ) {
            setGameRoomInfo({
              ...gameRoomInfo,
              awayReady: data.isReady,
            });
          } else if (
            user.id !== data.awayUser.id &&
            gameRoomInfo.homeUser.id === data.awayUser.id
          ) {
            setGameRoomInfo({
              ...gameRoomInfo,
              homeReady: data.isReady,
            });
          }
        }
      });

      gameSocket.off("exitGameRoom");
      gameSocket.on("exitGameRoom", (data) => {
        console.log("exitGameRoom", data);

        if (
          user.id !== data.awayUser.id &&
          gameRoomInfo.roomURL === data.gameRoomURL &&
          gameRoomInfo.awayUser.id === data.awayUser.id
        ) {
          setGameRoomInfo({
            ...gameRoomInfo,
            awayUser: {} as UserType,
          });
        } else if (
          user.id !== data.awayUser.id &&
          gameRoomInfo.roomURL === data.gameRoomURL &&
          gameRoomInfo.homeUser.id === data.awayUser.id
        ) {
          setGameRoomInfo({
            ...gameRoomInfo,
            homeUser: {} as UserType,
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
