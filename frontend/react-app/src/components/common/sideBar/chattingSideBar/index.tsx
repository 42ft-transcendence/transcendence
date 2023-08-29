import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { joinedDmPartnerListState } from "@recoil/atoms/directMessage";
import SideBarList from "../../sideBarList";
import ChannelListItem from "@components/channel/channelListItem";
import DirectMessageListItem from "@components/directMessage/directMessageListItem";
import { useRecoilState } from "recoil";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";
import ChannelJoinModal from "@components/modal/channel/channelJoinModal";
import ChannelCreateModal from "@components/modal/channel/channelCreateModal";
import { channelCreateModalState } from "@src/recoil/atoms/modal";
import { useNavigate } from "react-router-dom";

const ChattingSideBar = () => {
  const joinedChannelList = useRecoilValue(joinedChannelListState);
  const joinedDmPartnerList = useRecoilValue(joinedDmPartnerListState);
  const setChannelCreateModal = useSetRecoilState(channelCreateModalState);

  const [userData] = useRecoilState(userDataState);
  const [, setShowProfile] = useRecoilState(showProfileState);

  const navigate = useNavigate();

  const iconButtons: IconButtonProps[] = [
    {
      title: "채널 생성",
      iconSrc: "",
      onClick: () => {
        setChannelCreateModal(true);
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
        navigate("/channel-list");
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
          {joinedDmPartnerList.map((dmPartner) => (
            <DirectMessageListItem
              key={dmPartner.id}
              user={dmPartner}
              hasNewMessage={dmPartner.hasNewMessages}
            />
          ))}
        </SideBarList>
      </S.Container>
    </>
  );
};

export default ChattingSideBar;
