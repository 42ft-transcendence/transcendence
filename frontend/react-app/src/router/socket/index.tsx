import { ChatType, OfferGameType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { gameSocket, gameSocketConnect } from "./gameSocket";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { battleActionModalState } from "@src/recoil/atoms/modal";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  channelState,
  joinedChannelListState,
  messageListState,
} from "@src/recoil/atoms/channel";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { gameAcceptUser } from "@src/recoil/atoms/game";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");
  const [user] = useRecoilState(userDataState);
  const [, setBattleActionModal] = useRecoilState(battleActionModalState);
  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const channel = useRecoilValue(channelState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);
  const [gameUser, setGameUser] = useRecoilState(gameAcceptUser);

  if (!jwt) {
    chatSocket.disconnect();
    gameSocket.disconnect();
  } else {
    // Init chat socket events
    chatSocket.off("refresh_list");
    chatSocket.on("refresh_list", (userList: UserType[]) => {
      setAllUserList(userList);
    });

    chatSocket.off("get_message");
    chatSocket.on("get_message", (chat: ChatType) => {
      if (chat.message.channelId === channel?.id) {
        setMessageList((prev) => [...prev, chat.message]);
      } else {
        setJoinedChannelList((prev) =>
          prev.map((joinedChannel) =>
            chat.message.channelId === joinedChannel.id
              ? { ...joinedChannel, hasNewMessages: true }
              : joinedChannel,
          ),
        );
      }
    });

    chatSocket.off("get_dm");
    chatSocket.on("get_dm", ({ message, user }) => {
      console.log("dm", message, user);
      if (dmOther?.id === user.id) {
        setDmList((prev) => [...prev, message]);
      } else {
        setJoinedDmOtherList((prev) => {
          const filtered = prev.filter((other) => other.id !== user.id);
          return [{ ...user, hasNewMessages: true }, ...filtered];
        });
      }
    });

    gameSocket.off("offerGame");
    gameSocket.on("offerGame", (data: OfferGameType) => {
      console.log("대전 신청 소켓 통신 확인: ", data, data.user_id);
      console.log("user.id", user.id);
      setBattleActionModal({
        battleActionModal: user.id === data.user_id,
        awayUser: data.awayUser,
        gameRoomURL: data.gameRoomURL,
      });
    });

    gameSocket.off("acceptBattle");
    gameSocket.on("acceptBattle", (data) => {
      console.log("대전 신청 수락 소켓 통신 확인: ", data);
      // console.log("user.id 대전 신청 ", user.id);
      if (user.id === data.myData.id) {
        console.log("나다");
        console.log("gameUser111", gameUser);
        setGameUser({
          user: data.awayUser,
        });
        console.log("gameUser222", gameUser);
        setTimeout(() => {
          window.location.href = `/game/${data.gameRoomURL}`;
        }, 1000);
      }
    });

    chatSocketConnect(jwt);
    gameSocketConnect(jwt);
  }

  return children;
};

export default Socket;
