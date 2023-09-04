import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  channelState,
  joinedChannelListState,
  participantListState,
} from "@recoil/atoms/channel";
import {
  dmOtherState,
  joinedDmOtherListState,
} from "@recoil/atoms/directMessage";
import SideBarList, {
  SideBarFoldListPropsType,
} from "@components/common/sideBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";
import ChannelJoinModal from "@components/modal/channel/channelJoinModal";
import ChannelCreateModal from "@components/modal/channel/channelCreateModal";
import {
  channelCreateModalState,
  channelEditModalState,
  channelJoinModalState,
} from "@src/recoil/atoms/modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { chatSocket } from "@router/socket/chatSocket";
import ChannelEditModal from "@src/components/modal/channel/channelEditModal";
import { userDataState } from "@src/recoil/atoms/common";
import ParticipantListItem from "@src/components/channel/participantListItem";

const ChattingSideBar = () => {
  const [joinedChannelList, setJoinedChannelList] = useRecoilState(
    joinedChannelListState,
  );
  const joinedDmOtherList = useRecoilValue(joinedDmOtherListState);
  const [isChannelJoinModalOpened] = useRecoilState(channelJoinModalState);
  const [isChannelCreateModalOpened, setChannelCreateModal] = useRecoilState(
    channelCreateModalState,
  );
  const [isChannelEditModalOpened, setChannelEditModal] = useRecoilState(
    channelEditModalState,
  );
  const [iconButtons, setIconButtons] = useState<IconButtonProps[]>([]);
  const channel = useRecoilValue(channelState);
  const dmOther = useRecoilValue(dmOtherState);
  const userData = useRecoilValue(userDataState);
  const participantList = useRecoilValue(participantListState);
  const [sideBarList, setSideBarList] = useState<SideBarFoldListPropsType[]>(
    [],
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (channel !== null) {
      setIconButtons([
        {
          title: "채널 탈퇴",
          iconSrc: "",
          onClick: () => {
            chatSocket.emit("leave_channel", { channelId: channel.id }, () => {
              setJoinedChannelList((prev) =>
                prev.filter((joinedChannel) => joinedChannel.id !== channel.id),
              );
              navigate("/channel-list");
            });
          },
          theme: "LIGHT",
        },
        {
          title: "채널 탐색",
          iconSrc: "",
          onClick: () => {
            navigate("/channel-list");
          },
          theme: "LIGHT",
        },
        {
          title: "채널 수정",
          iconSrc: "",
          onClick: () => {
            setChannelEditModal(true);
          },
          theme: "LIGHT",
        },
      ]);
      if (channel.ownerId === userData.id) {
        setIconButtons((prev) => [
          ...prev,
          {
            title: "채널 삭제",
            iconSrc: "",
            onClick: () => {
              chatSocket.emit(
                "delete_channel",
                { channelId: channel.id },
                () => {
                  setJoinedChannelList((prev) =>
                    prev.filter((ch) => ch.id !== channel.id),
                  );
                  navigate("/channel-list");
                },
              );
            },
            theme: "LIGHT",
          },
        ]);
      }
    } else if (dmOther) {
      setIconButtons([
        {
          title: "채널 탐색",
          iconSrc: "",
          onClick: () => {
            navigate("/channel-list");
          },
          theme: "LIGHT",
        },
      ]);
    } else {
      setIconButtons([
        {
          title: "채널 생성",
          iconSrc: "",
          onClick: () => {
            setChannelCreateModal(true);
          },
          theme: "LIGHT",
        },
      ]);
    }
  }, [
    channel,
    dmOther,
    setIconButtons,
    navigate,
    setChannelCreateModal,
    setJoinedChannelList,
    userData.id,
    setChannelEditModal,
  ]);

  useEffect(() => {
    const tempList = [
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
    ];
    setSideBarList(() => {
      if (channel) {
        return [
          {
            title: "참여자 목록",
            children: participantList.map((participant) => (
              <ParticipantListItem
                key={participant.id}
                participant={participant}
              />
            )),
          },
          ...tempList,
        ];
      } else {
        return tempList;
      }
    });
  }, [channel, joinedChannelList, joinedDmOtherList, participantList]);

  return (
    <>
      {isChannelJoinModalOpened && <ChannelJoinModal />}
      {isChannelCreateModalOpened && <ChannelCreateModal />}
      {isChannelEditModalOpened && <ChannelEditModal />}
      <S.Container>
        <ButtonList buttons={iconButtons} />
        <SideBarList lists={sideBarList} />
      </S.Container>
    </>
  );
};

export default ChattingSideBar;
