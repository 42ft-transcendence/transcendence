import { useEffect, useState } from "react";
import ChannelPageView from "./view";
import { chatSocket } from "@router/socket/chatSocket";
import {
  ChatType,
  MessageType,
  ParticipantType,
  ChannelType,
  EnterChannelReturnType,
  SendMessageReturnType,
} from "@src/types";
import { useParams } from "react-router-dom";
import {
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import { useRecoilState, useSetRecoilState } from "recoil";

const ChannelPageContainer = () => {
  const setChannel = useSetRecoilState(channelState);
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const [participantList, setParticipantList] =
    useRecoilState(participantListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();

  const handleSendMessage = (content: string) => {
    chatSocket.emit(
      "send_message",
      { message: content },
      ({ message }: SendMessageReturnType) => {
        setMessageList((prev) => [...prev, message]);
      },
    );
  };

  const handleInvite = () => {
    // TODO: invite
  };

  // Assemble chat list
  useEffect(() => {
    setChatList(() => {
      const rawChatList = messageList.map((message) => {
        const from = participantList.find((user) => user.id === message.userId);
        if (!from || !from.user) return undefined;
        else if (from.owner) return { message, user: from.user, role: "owner" };
        else if (from.admin) return { message, user: from.user, role: "admin" };
        else return { message, user: from.user, role: "attendee" };
      });
      return rawChatList.filter((chat) => chat !== undefined) as ChatType[];
    });
  }, [setChatList, messageList, participantList]);

  // Get channel info at enter
  useEffect(() => {
    const channelId = params.channelId;

    chatSocket.emit(
      "enter_channel",
      channelId,
      ({ channel, messages, participants }: EnterChannelReturnType) => {
        setChannel(channel);
        setMessageList(messages);
        setParticipantList(participants);
      },
    );
    setJoinedChannelList((prev) =>
      prev.map((joinedChannel) =>
        channelId === joinedChannel.id
          ? { ...joinedChannel, hasNewMessages: false }
          : joinedChannel,
      ),
    );

    return () => {
      setChannel(null);
      setMessageList([]);
      setParticipantList([]);
    };
  }, [
    params,
    setChannel,
    setMessageList,
    setParticipantList,
    setJoinedChannelList,
  ]);

  return (
    <ChannelPageView
      onSendMessage={handleSendMessage}
      onInvite={handleInvite}
      chatList={chatList}
    />
  );
};

export default ChannelPageContainer;
