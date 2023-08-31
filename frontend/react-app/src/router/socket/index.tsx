import { ChannelType, ChatType, ParticipantType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allChannelListState,
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import { allUserListState } from "@src/recoil/atoms/common";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { useEffect } from "react";
import { RefreshChannelType } from "@src/types/channel.type";
import { useNavigate } from "react-router-dom";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");

  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const [channel, setChannel] = useRecoilState(channelState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);
  const setAllChannelList = useSetRecoilState(allChannelListState);
  const setParticipantList = useSetRecoilState(participantListState);
  const navigate = useNavigate();

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

    chatSocket.off("refresh_channel");
    chatSocket.on(
      "refresh_channel",
      ({ newChannel, newParticipantList }: RefreshChannelType) => {
        setJoinedChannelList((prev) =>
          prev.map((prevChannel) =>
            prevChannel.id === newChannel.id
              ? { ...newChannel, hasNewMessages: prevChannel.hasNewMessages }
              : prevChannel,
          ),
        );
        if (channel?.id === newChannel.id) {
          console.log("participants", newChannel.participants);
          setChannel(newChannel);
          setParticipantList(newParticipantList);
        }
      },
    );

    chatSocket.off("refresh_all_channels");
    chatSocket.on("refresh_all_channels", (channelList: ChannelType[]) => {
      setAllChannelList(channelList);
    });

    chatSocket.off("kicked");
    chatSocket.on("kicked", (channelId: string) => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== channelId),
      );
      if (channel?.id === channelId) {
        navigate("/channel-list");
        alert("채널에서 추방되었습니다.");
      }
    });

    chatSocketConnect(jwt);
  }

  return children;
};

export default Socket;
