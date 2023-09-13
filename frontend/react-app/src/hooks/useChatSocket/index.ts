import { allUserListState, userDataState } from "@src/recoil/atoms/common";
import {
  ChannelType,
  ChatType,
  DirectMessageType,
  MessageType,
  ParticipantType,
  UserStatus,
  UserType,
} from "@src/types";
import { chatSocket } from "@src/utils/sockets/chatSocket";
import { useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useMatch, useNavigate } from "react-router-dom";
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
import { channelInviteAcceptModalState } from "@src/recoil/atoms/modal";
import { getAllChannels, getAllUserList, getUser } from "@src/api";
import { getMyChannels } from "@src/api/participants";
import { getDM } from "@src/api/dm";

const useChatSocket = () => {
  const isLogin = useMatch("/login");
  const isAuth = useMatch("/auth/:type");
  const isSignUp = useMatch("/signup");
  const [token, ,] = useCookies(["jwt"]);
  const [user, setUserData] = useRecoilState(userDataState);
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
   * Chat Socket Events Handlers
   */

  const handleRefreshUsers = useCallback(
    (content: UserType[]) => {
      setAllUserList(content);
    },
    [setAllUserList],
  );

  const handleGetMessage = useCallback(
    ({ message }: { message: MessageType }) => {
      if (message.channelId === curChannel?.id) {
        setMessageList((prev) => [...prev, message]);
      } else {
        setJoinedChannelList((prev) =>
          prev.map((joinedChannel) =>
            message.channelId === joinedChannel.id
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
      if (curChannel?.id === content) {
        navigate("/channel-list");
        alert("채널에서 추방되었습니다.");
      }
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== content),
      );
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

  /** ChatSocket Connection */
  useEffect(() => {
    if (!isLogin && !isAuth && !isSignUp && token.jwt) {
      chatSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${token.jwt}`,
      };
      chatSocket.connect();
    }

    return () => {
      chatSocket.disconnect();
    };
    // token 의 변화에만 반응
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /** Get User Data on Connection */
  useEffect(() => {
    chatSocket.on("connect", () => {
      getUser()
        .then((res) => {
          setUserData(res.data);
          getAllUserList()
            .then(({ data }) => {
              setAllUserList(data);
            })
            .catch((err) => {
              console.error(err);
            });
          getAllChannels()
            .then(({ data }) => {
              setAllChannelList(data);
            })
            .catch((err) => {
              console.error(err);
            });
          getMyChannels()
            .then(({ data }) => {
              setJoinedChannelList(
                data.map((channel) => ({
                  ...channel,
                  hasNewMessages: false,
                })),
              );
            })
            .catch((err) => {
              console.error(err);
            });
          getDM()
            .then(({ data }) => {
              const dmOthers = data
                .map((dm) => (dm.from.id === res.data.id ? dm.to : dm.from))
                .filter((other, index) => {
                  dmOthers.findIndex((other2) => other.id === other2.id) ===
                    index;
                })
                .map((other) => ({ ...other, hasNewMessages: false }));
              setJoinedDmOtherList(dmOthers);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [
    setAllChannelList,
    setAllUserList,
    setJoinedChannelList,
    setJoinedDmOtherList,
    setUserData,
  ]);

  /** Reset User Data on Disconnection */
  useEffect(() => {
    chatSocket.on("disconnect", () => {
      setUserData({} as UserType);
      setAllUserList([]);
      setAllChannelList([]);
      setJoinedChannelList([]);
      setJoinedDmOtherList([]);
    });
  }, [
    setUserData,
    setAllUserList,
    setAllChannelList,
    setJoinedChannelList,
    setJoinedDmOtherList,
  ]);

  /** ChatSocket Event Listeners */
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
};

export default useChatSocket;
