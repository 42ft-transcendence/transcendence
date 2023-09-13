import { useEffect } from "react";
import ChannelPageView from "./view";
import { chatSocket } from "@src/utils/sockets/chatSocket";
import { EnterChannelReturnType } from "@src/types";
import { useNavigate, useParams } from "react-router-dom";
import {
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import { useSetRecoilState } from "recoil";

const ChannelPageContainer = () => {
  const setChannel = useSetRecoilState(channelState);
  const setMessageList = useSetRecoilState(messageListState);
  const setParticipantList = useSetRecoilState(participantListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const params = useParams();
  const navigate = useNavigate();

  // Get channel info at enter
  useEffect(() => {
    const channelId = params.channelId as string;

    chatSocket.emit(
      "enter_channel",
      { channelId },
      ({ channel, messages, participants }: EnterChannelReturnType) => {
        console.log("enter_channel return", channel, messages, participants);
        if (channel && messages && participants) {
          setChannel(channel);
          setMessageList(messages);
          setParticipantList(participants);
        } else {
          setJoinedChannelList((prev) =>
            prev.filter((channel) => channel.id !== channelId),
          );
          navigate("/channel-list");
          alert("가입한 적 없거나 존재하지 않는 채널입니다.");
        }
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
    navigate,
  ]);

  return <ChannelPageView />;
};

export default ChannelPageContainer;
