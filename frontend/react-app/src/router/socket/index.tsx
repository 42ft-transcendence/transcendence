import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import {
  ChannelType,
  ChatType,
  DirectMessageType,
  OfferGameType,
  ParticipantType,
  UserStatus,
  UserType,
} from "@type";
import { gameSocket } from "./gameSocket";
import { userDataState } from "@src/recoil/atoms/common";
import {
  battleActionModalState,
  channelInviteAcceptModalState,
} from "@src/recoil/atoms/modal";
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
import useGameSocket from "@src/hooks/useGameSocket";
import { RefreshChannelType } from "@src/types/channel.type";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const [user] = useRecoilState(userDataState);
  const [, setBattleActionModal] = useRecoilState(battleActionModalState);
  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const [curChannel, setChannel] = useRecoilState(channelState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);
  const setAllChannelList = useSetRecoilState(allChannelListState);
  const setParticipantList = useSetRecoilState(participantListState);
  const setInvite = useSetRecoilState(channelInviteAcceptModalState);
  const navigate = useNavigate();

  /**
   * Init socket connection
   */
  useEffect(() => {
    const jwt = cookies.load("jwt");
    if (jwt) {
      chatSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${jwt}`,
      };
      gameSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${jwt}`,
      };
      chatSocket.connect();
      gameSocket.connect();
    }

    return () => {
      chatSocket.disconnect();
      gameSocket.disconnect();
    };
  }, []);

  useGameSocket();

  /**
   * Chat Socket Events Handlers
   */

  const handleRefreshUsers = useCallback(
    (content: UserType[]) => {
      setAllUserList(content);
    },
    [setAllUserList],
  );

  const handleGetMessage = useCallback(
    (content: ChatType) => {
      if (content.message.channelId === curChannel?.id) {
        setMessageList((prev) => [...prev, content.message]);
      } else {
        setJoinedChannelList((prev) =>
          prev.map((joinedChannel) =>
            content.message.channelId === joinedChannel.id
              ? { ...joinedChannel, hasNewMessages: true }
              : joinedChannel,
          ),
        );
      }
    },
    [curChannel?.id, setMessageList, setJoinedChannelList],
  );

  const handleGetDm = useCallback(
    (content: { user: UserType; message: DirectMessageType }) => {
      if (dmOther?.id === content.user.id) {
        setDmList((prev) => [...prev, content.message]);
      } else {
        setJoinedDmOtherList((prev) => {
          const filtered = prev.filter((other) => other.id !== content.user.id);
          return [{ ...content.user, hasNewMessages: true }, ...filtered];
        });
      }
    },
    [dmOther?.id, setDmList, setJoinedDmOtherList],
  );

  const handleRefreshChannel = useCallback(
    (content: { channel: ChannelType; participants: ParticipantType[] }) => {
      setJoinedChannelList((prev) =>
        prev.map((prevChannel) =>
          prevChannel.id === content.channel.id
            ? { ...content.channel, hasNewMessages: prevChannel.hasNewMessages }
            : prevChannel,
        ),
      );
      if (curChannel?.id === content.channel.id) {
        setChannel(content.channel);
        setParticipantList(content.participants);
      }
    },
    [curChannel?.id, setChannel, setJoinedChannelList, setParticipantList],
  );

  const handleRefreshAllChannels = useCallback(
    (content: ChannelType[]) => {
      setAllChannelList(content);
    },
    [setAllChannelList],
  );

  const handleKicked = useCallback(
    (content: string) => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== content),
      );
      if (curChannel?.id === content) {
        navigate("/channel-list");
        alert("채널에서 추방되었습니다.");
      }
    },
    [setJoinedChannelList, curChannel?.id, navigate],
  );

  const handleChannelDeleted = useCallback(
    (content: string) => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== content),
      );
      if (curChannel?.id === content) {
        navigate("/channel-list");
        alert("채널이 삭제되었습니다.");
      }
    },
    [setJoinedChannelList, curChannel?.id, navigate],
  );

  const handleGetInvite = useCallback(
    (content: { user: UserType; channel: ChannelType }) => {
      if (user?.status === UserStatus.ONLINE) {
        setInvite({ user: content.user, channel: content.channel });
      }
    },
    [setInvite, user?.status],
  );

  /**
   * ChatSocket Event Listeners
   */
  useEffect(() => {
    chatSocket.on("refresh_users", handleRefreshUsers);
    return () => {
      chatSocket.off("refresh_users");
    };
  }, [handleRefreshUsers]);

  useEffect(() => {
    chatSocket.on("get_message", handleGetMessage);
    return () => {
      chatSocket.off("get_message");
    };
  }, [handleGetMessage]);

  useEffect(() => {
    chatSocket.on("get_dm", handleGetDm);
    return () => {
      chatSocket.off("get_dm");
    };
  }, [handleGetDm]);

  useEffect(() => {
    chatSocket.on("refresh_channel", handleRefreshChannel);
    return () => {
      chatSocket.off("refresh_channel");
    };
  }, [handleRefreshChannel]);

  useEffect(() => {
    chatSocket.on("refresh_all_channels", handleRefreshAllChannels);
    return () => {
      chatSocket.off("refresh_all_channels");
    };
  }, [handleRefreshAllChannels]);

  useEffect(() => {
    chatSocket.on("kicked", handleKicked);
    return () => {
      chatSocket.off("kicked");
    };
  }, [handleKicked]);

  useEffect(() => {
    chatSocket.on("channel_deleted", handleChannelDeleted);
    return () => {
      chatSocket.off("channel_deleted");
    };
  }, [handleChannelDeleted]);

  useEffect(() => {
    chatSocket.on("get_invite", handleGetInvite);
    return () => {
      chatSocket.off("get_invite");
    };
  }, [handleGetInvite]);

  return children;
};

export default Socket;
