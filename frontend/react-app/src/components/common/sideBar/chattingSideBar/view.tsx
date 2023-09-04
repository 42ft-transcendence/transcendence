import ChannelCreateModal from "@components/modal/channel/channelCreateModal";
import ChannelEditModal from "@components/modal/channel/channelEditModal";
import ChannelJoinModal from "@components/modal/channel/channelJoinModal";
import SideBarList, {
  SideBarFoldListPropsType,
} from "@components/common/sideBarList";
import { ButtonList, IconButtonProps } from "@components/buttons";
import { useRecoilValue } from "recoil";
import {
  channelCreateModalState,
  channelEditModalState,
  channelInviteModalState,
  channelJoinModalState,
} from "@recoil/atoms/modal";
import * as S from "../index.styled";
import ChannelInviteModal from "@src/components/modal/channel/channelInviteModal";

export interface ChattingSideBarViewPropsType {
  iconButtons: IconButtonProps[];
  sideBarList: SideBarFoldListPropsType[];
}

const ChattingSideBarView = ({
  iconButtons,
  sideBarList,
}: ChattingSideBarViewPropsType) => {
  const isChannelJoinModalOpened = useRecoilValue(channelJoinModalState);
  const isChannelCreateModalOpened = useRecoilValue(channelCreateModalState);
  const isChannelEditModalOpened = useRecoilValue(channelEditModalState);
  const isChannelInviteModalOpened = useRecoilValue(channelInviteModalState);

  return (
    <>
      {isChannelJoinModalOpened && <ChannelJoinModal />}
      {isChannelCreateModalOpened && <ChannelCreateModal />}
      {isChannelEditModalOpened && <ChannelEditModal />}
      {isChannelInviteModalOpened && <ChannelInviteModal />}
      <S.Container>
        <ButtonList buttons={iconButtons} />
        <SideBarList lists={sideBarList} />
      </S.Container>
    </>
  );
};

export default ChattingSideBarView;
