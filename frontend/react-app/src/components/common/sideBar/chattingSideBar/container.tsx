import { IconButtonProps } from "@components/buttons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  channelState,
  joinedChannelListState,
  participantListState,
} from "@recoil/atoms/channel";
import { joinedDmOtherListState } from "@recoil/atoms/directMessage";
import { SideBarFoldListPropsType } from "@components/common/sideBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";
import {
  channelCreateModalState,
  channelEditModalState,
} from "@recoil/atoms/modal";
import { useMatch, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { chatSocket } from "@utils/sockets/chatSocket";
import { userDataState } from "@recoil/atoms/common";
import ParticipantListItem from "@components/channel/participantListItem";
import ChattingSideBarView from "./view";

const ChattingSideBarContainer = () => {
  const [joinedChannelList, setJoinedChannelList] = useRecoilState(
    joinedChannelListState,
  );
  const joinedDmOtherList = useRecoilValue(joinedDmOtherListState);
  const setChannelCreateModal = useSetRecoilState(channelCreateModalState);
  const setChannelEditModal = useSetRecoilState(channelEditModalState);
  const [iconButtons, setIconButtons] = useState<IconButtonProps[]>([]);
  const channel = useRecoilValue(channelState);
  const userData = useRecoilValue(userDataState);
  const participantList = useRecoilValue(participantListState);
  const [sideBarList, setSideBarList] = useState<SideBarFoldListPropsType[]>(
    [],
  );

  const isChannel = useMatch("/channel/:channelId");
  const isDM = useMatch("/direct-message/:dmId");
  const navigate = useNavigate();

  const handleLeaveChannel = useCallback(() => {
    if (!channel) return;
    chatSocket.emit("leave_channel", { channelId: channel.id }, () => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== channel.id),
      );
      navigate("/channel-list");
    });
  }, [channel, navigate, setJoinedChannelList]);

  const handleEditChannel = useCallback(() => {
    setChannelEditModal(true);
  }, [setChannelEditModal]);

  const handleSearchChannel = useCallback(() => {
    navigate("/channel-list");
  }, [navigate]);

  const handleDeleteChannel = useCallback(() => {
    if (!channel) return;
    navigate("/channel-list");
    chatSocket.emit("delete_channel", { channelId: channel.id }, () => {
      setJoinedChannelList((prev) => prev.filter((ch) => ch.id !== channel.id));
    });
  }, [channel, navigate, setJoinedChannelList]);

  const handleCreateChannel = useCallback(() => {
    setChannelCreateModal(true);
  }, [setChannelCreateModal]);

  const channelButtons = useMemo(() => {
    const buttons = [
      {
        title: "채널 탈퇴",
        iconSrc: "",
        onClick: handleLeaveChannel,
        theme: "LIGHT",
      },
      {
        title: "채널 수정",
        iconSrc: "",
        onClick: handleEditChannel,
        theme: "LIGHT",
      },
      {
        title: "채널 탐색",
        iconSrc: "",
        onClick: handleSearchChannel,
        theme: "LIGHT",
      },
    ];
    if (channel?.ownerId === userData.id) {
      buttons.push({
        title: "채널 삭제",
        iconSrc: "",
        onClick: handleDeleteChannel,
        theme: "LIGHT",
      });
    }
    return buttons as IconButtonProps[];
  }, [
    handleDeleteChannel,
    handleEditChannel,
    handleLeaveChannel,
    handleSearchChannel,
    channel?.ownerId,
    userData.id,
  ]);

  const dmButtons = useMemo(
    () =>
      [
        {
          title: "채널 탐색",
          iconSrc: "",
          onClick: handleSearchChannel,
          theme: "LIGHT",
        },
      ] as IconButtonProps[],
    [handleSearchChannel],
  );

  const channelListButtons = useMemo(
    () =>
      [
        {
          title: "채널 생성",
          iconSrc: "",
          onClick: handleCreateChannel,
          theme: "LIGHT",
        },
      ] as IconButtonProps[],
    [handleCreateChannel],
  );

  const commonSidebarList = useMemo(
    () => [
      {
        title: "참여한 채널",
        children: joinedChannelList.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            hasNewMessage={channel.hasNewMessages}
          />
        )),
      },
      {
        title: "다이렉트 메세지",
        children: joinedDmOtherList.map((dmOther) => (
          <DirectMessageListItem
            key={dmOther.id}
            user={dmOther}
            hasNewMessage={dmOther.hasNewMessages}
          />
        )),
      },
    ],
    [joinedChannelList, joinedDmOtherList],
  );

  const channelSidebarList = useMemo(
    () => [
      {
        title: "참여자 목록",
        children: participantList.map((participant) => (
          <ParticipantListItem key={participant.id} participant={participant} />
        )),
      },
    ],
    [participantList],
  );

  useEffect(() => {
    if (isChannel) {
      setIconButtons(channelButtons);
      setSideBarList([...commonSidebarList, ...channelSidebarList]);
    } else if (isDM) {
      setIconButtons(dmButtons);
      setSideBarList(commonSidebarList);
    } else {
      setIconButtons(channelListButtons);
      setSideBarList(commonSidebarList);
    }
  }, [
    isChannel,
    isDM,
    channelButtons,
    dmButtons,
    channelListButtons,
    commonSidebarList,
    channelSidebarList,
  ]);

  return (
    <ChattingSideBarView iconButtons={iconButtons} sideBarList={sideBarList} />
  );
};

export default ChattingSideBarContainer;
