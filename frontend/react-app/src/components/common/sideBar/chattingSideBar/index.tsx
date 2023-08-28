import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilValue } from "recoil";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { JoinedDirectMessageListState } from "@recoil/atoms/directMessage";
import SideBarList from "../../sidaBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";
import { useRecoilState } from "recoil";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";
import ChannelJoinModal from "@components/modal/channel/channelJoinModal";
import ChannelCreateModal from "@components/modal/channel/channelCreateModal";

const ChattingSideBar = () => {
  const joinedChannelList = useRecoilValue(joinedChannelListState);
  const joinedDirectMessageList = useRecoilValue(JoinedDirectMessageListState);

  const [userData] = useRecoilState(userDataState);
  const [, setShowProfile] = useRecoilState(showProfileState);

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
    {
      title: "프로필 모달 테스트",
      iconSrc: "",
      onClick: ProfileModalOnClickHandler(setShowProfile, true, userData),
      theme: "LIGHT",
    },
  ];

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
          {joinedDirectMessageList.map((dm) => (
            <DirectMessageListItem
              key={dm.id}
              user={dm}
              hasNewMessage={dm.hasNewMessages}
            />
          ))}
        </SideBarList>
      </S.Container>
    </>
  );
};

export default ChattingSideBar;
