import { ChatType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  channelState,
  joinedChannelListState,
  messageListState,
} from "@src/recoil/atoms/channel";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");

  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const channel = useRecoilValue(channelState);

  if (!jwt) {
    chatSocket.disconnect();
  } else {
    // Init chat socket events
    chatSocket.off("refresh_list");
    chatSocket.on("refresh_list", (userList: UserType[]) => {
      console.log("refresh_list", userList);
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

    // chatSocket.off("get_dm");
    // chatSocket.on("get_dm", () => {});

    chatSocketConnect(jwt);
  }

  return children;
};

export default Socket;
