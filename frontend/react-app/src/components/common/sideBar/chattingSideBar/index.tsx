import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilValue } from "recoil";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { JoinedDirectMessageListState } from "@recoil/atoms/directMessage";
import SideBarList from "../../sidaBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";

const ChattingSideBar = () => {
  const joinedChannelList = useRecoilValue(joinedChannelListState);
  const joinedDirectMessageList = useRecoilValue(JoinedDirectMessageListState);

  const iconButtons: IconButtonProps[] = [
    {
      title: "채널 생성",
      iconSrc: "",
      onClick: () => {
        console.log("채널 생성");
      },
      theme: "LIGHT",
    },
    {
      title: "채널 탈퇴",
      iconSrc: "",
      onClick: () => {
        console.log("채널 탈퇴");
      },
      theme: "LIGHT",
    },
    {
      title: "채널 탐색",
      iconSrc: "",
      onClick: () => {
        console.log("채널 탐색");
      },
      theme: "LIGHT",
    },
  ];

  return (
    <S.Container>
      <ButtonList buttons={iconButtons} />
      <SideBarList title="참여한 채널">
        {joinedChannelList.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            onClick={(channel) => {
              console.log("채널 클릭", channel);
            }}
            hasNewMessage={channel.hasNewMessages}
          />
        ))}
      </SideBarList>
      <SideBarList title="다이렉트 메세지">
        {joinedDirectMessageList.map((dm) => (
          <DirectMessageListItem
            key={dm.id}
            user={dm}
            onClick={(user) => {
              console.log("DM 클릭", user);
            }}
            hasNewMessage={dm.hasNewMessages}
          />
        ))}
      </SideBarList>
    </S.Container>
  );
};

export default ChattingSideBar;
