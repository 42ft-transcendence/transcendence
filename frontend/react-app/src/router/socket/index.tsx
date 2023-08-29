import { ChatType, DirectMessageType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  channelState,
  joinedChannelListState,
  messageListState,
} from "@src/recoil/atoms/channel";
import { allUserListState } from "@src/recoil/atoms/common";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");

  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const channel = useRecoilValue(channelState);
  const [joinedDmOtherList, setJoinedDmOtherList] = useRecoilState(
    joinedDmOtherListState,
  );
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);

  if (!jwt) {
    chatSocket.disconnect();
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
    chatSocket.on("get_dm", (dm: DirectMessageType) => {
      console.log("dm", dm);
      if (dmOther?.id === dm.from.id) {
        setDmList((prev) => [...prev, dm]);
      } else if (joinedDmOtherList.find((other) => other.id === dm.from.id)) {
        setJoinedDmOtherList((prev) =>
          prev.map((other) =>
            other.id === dm.from.id
              ? { ...other, hasNewMessages: true }
              : other,
          ),
        );
      } else {
        setJoinedDmOtherList((prev) => [
          ...prev,
          { ...dm.from, hasNewMessages: true },
        ]);
      }
    });

    chatSocketConnect(jwt);
  }

  return children;
};

export default Socket;
