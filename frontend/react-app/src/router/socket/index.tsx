import { ChatType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { userDataState } from "@src/recoil/atoms/common";
import { battleActionModalState } from "@src/recoil/atoms/modal";
import { allUserListState } from "@src/recoil/atoms/common";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allChannelListState,
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";

import { useEffect } from "react";
import { RefreshChannelType } from "@src/types/channel.type";
import { useNavigate } from "react-router-dom";
import useGameSocket from "@src/hooks/useGameSocket";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");
  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const [curChannel, setChannel] = useRecoilState(channelState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);

  useGameSocket(jwt);

  if (!jwt) {
    chatSocket.disconnect();
  } else {
    // Init chat socket events
    chatSocket.off("refresh_users");
    chatSocket.on("refresh_users", (userList: UserType[]) => {
      setAllUserList(userList);
    });

    chatSocket.off("get_message");
    chatSocket.on("get_message", (chat: ChatType) => {
      if (chat.message.channelId === curChannel?.id) {
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

    chatSocketConnect(jwt);
  }

  return children;
};

export default Socket;
