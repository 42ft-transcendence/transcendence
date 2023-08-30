import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { channelState, joinedChannelListState } from "@recoil/atoms/channel";
import {
  dmOtherState,
  joinedDmOtherListState,
} from "@recoil/atoms/directMessage";
import SideBarList from "../../sideBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";
import ChannelJoinModal from "@components/modal/channel/channelJoinModal";
import ChannelCreateModal from "@components/modal/channel/channelCreateModal";
import { channelCreateModalState } from "@src/recoil/atoms/modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { chatSocket } from "@router/socket/chatSocket";

const ChattingSideBar = () => {
  const [joinedChannelList, setJoinedChannelList] = useRecoilState(
    joinedChannelListState,
  );
  const joinedDmOtherList = useRecoilValue(joinedDmOtherListState);
  const setChannelCreateModal = useSetRecoilState(channelCreateModalState);
  const [iconButtons, setIconButtons] = useState<IconButtonProps[]>([]);
  const channel = useRecoilValue(channelState);
  const dmOther = useRecoilValue(dmOtherState);

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
      ]);
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
  ]);

  return (
    <>
      <ChannelJoinModal />
      <ChannelCreateModal />
      <S.Container>
        <ButtonList buttons={iconButtons} />
        <SideBarList title="참여한 채널">
          {joinedChannelList.map((channel) => (
            <ChannelListItem
              key={channel.id}
              channel={channel}
              hasNewMessage={channel.hasNewMessages}
            />
          ))}
        </SideBarList>
        <SideBarList title="다이렉트 메세지">
          {joinedDmOtherList.map((dmOther) => (
            <DirectMessageListItem
              key={dmOther.id}
              user={dmOther}
              hasNewMessage={dmOther.hasNewMessages}
            />
          ))}
        </SideBarList>
      </S.Container>
    </>
  );
};

export default ChattingSideBar;
