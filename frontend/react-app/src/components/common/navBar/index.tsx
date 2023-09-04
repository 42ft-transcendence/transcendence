import * as S from "./index.styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { LowerTabList, SettingOptionModal, UpperTabList } from "./container";
import { showProfileState } from "@src/recoil/atoms/common";
import ProfileModal from "@src/components/modal/profile";
import {
  battleActionModalState,
  channelInviteAcceptModalState,
} from "@src/recoil/atoms/modal";
import BattleActionModal from "@src/components/modal/game/BattleActionModal";
import ChannelInviteAcceptModal from "@src/components/modal/channel/channelInviteAcceptModal";

export interface NavBarPropsType {
  currentPath: string;
}

const NavBar = () => {
  const [showProfile] = useRecoilState(showProfileState);
  const [battleActionModal] = useRecoilState(battleActionModalState);
  const channelInvite = useRecoilValue(channelInviteAcceptModalState);

  return (
    <S.Container>
      <UpperTabList />
      <LowerTabList />
      {/* 아래는 모달 적용 영역입니다 */}
      <SettingOptionModal />
      {showProfile && <ProfileModal />}
      {battleActionModal.battleActionModal && <BattleActionModal />}
      {channelInvite && <ChannelInviteAcceptModal />}
    </S.Container>
  );
};

export default NavBar;
