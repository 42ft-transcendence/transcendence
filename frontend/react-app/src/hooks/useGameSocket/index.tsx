import { userDataState } from "@src/recoil/atoms/common";
import {
  gameModalState,
  gameRoomChatListState,
  gameRoomInfoState,
  gameRoomListState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import {
  battleActionModalState,
  gameAlertModalState,
} from "@src/recoil/atoms/modal";
import { gameSocket, gameSocketConnect } from "@src/router/socket/gameSocket";
import { OfferGameType } from "@src/types";
import { GameMapType, GameRoomInfoType } from "@src/types/game.type";
import { useEffect } from "react";
import * as cookies from "react-cookies";
import { useRecoilState, useSetRecoilState } from "recoil";

const useGameSocket = () => {
  const setBattleActionModal = useSetRecoilState(battleActionModalState);
  const [userData] = useRecoilState(userDataState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);
  const [, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [, setGameRoomList] = useRecoilState(gameRoomListState);
  const [, setGameModal] = useRecoilState(gameModalState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);
  const jwt = cookies.load("jwt");

  useEffect(() => {
    if (!jwt) {
      gameSocket.disconnect();
    } else {
      // console.log("gamesocket connected");
      gameSocket.off("roomList");
      gameSocket.on("roomList", (data: GameRoomInfoType[]) => {
        setGameRoomList(data);
        if (data.find((room) => room.roomURL === gameRoomURL) !== undefined) {
          setGameRoomInfo((prevInfo) => ({
            ...prevInfo,
            ...data.find((room) => room.roomURL === gameRoomURL),
          }));
        }
      });

      gameSocket.off("offerBattle");
      gameSocket.on("offerBattle", (data: OfferGameType) => {
        console.log(data, userData);
        if (data.awayUser.id === userData.id) {
          setBattleActionModal({
            battleActionModal: true,
            awayUser: data.myData,
            gameRoomURL: data.gameRoomURL,
          });
        }
      });

      gameSocket.off("acceptBattle");
      gameSocket.on("acceptBattle", (data) => {
        console.log("acceptBattle", data, userData);
        if (data.user1Id === userData.id || data.user2Id === userData.id) {
          setGameRoomInfo(data.gameRoom);
          setGameRoomURL(data.gameRoomURL);
          setGameRoomChatList([]);
          window.location.href = `/game/${data.gameRoomURL}`;
        }
      });

      gameSocket.off("rejectBattle");
      gameSocket.on("rejectBattle", (data) => {
        if (data.awayUserId === userData.id) {
          setGameAlertModal({
            gameAlertModal: true,
            gameAlertModalMessage: "상대방이 대전 신청을 거절했습니다.",
            shouldRedirect: false,
            shouldInitInfo: true,
          });
          setGameRoomChatList([]);
          setGameRoomInfo(data.gameRoom);
        }
      });

      gameSocket.on("startGame", (data) => {
        if (data.gameRoomURL !== gameRoomURL) return;
        setGameModal({
          gameMap: "NORMAL" as GameMapType,
        });
      });

      gameSocketConnect(jwt);
    }

    return () => {
      // 소켓 이벤트 해제 로직 (cleanup function)
      gameSocket.off("offerBattle");
      gameSocket.off("acceptBattle");
      gameSocket.off("rejectBattle");
      // ... (다른 gameSocket 이벤트 해제 로직)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, gameRoomURL]); // 의존성 배열에 필요한 값들을 넣어주세요.
};

export default useGameSocket;
