import * as S from "./index.styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { LowerTabList, SettingOptionModal, UpperTabList } from "./container";
import { isFirstLoginState, showProfileState } from "@src/recoil/atoms/common";
import ProfileModal from "@src/components/modal/profile";
import {
  battleActionModalState,
  channelInviteAcceptModalState,
  gameAlertModalState,
} from "@src/recoil/atoms/modal";
import BattleActionModal from "@src/components/modal/game/BattleActionModal";
import GameAlertModal from "@src/components/modal/game/gameAlertModal";
import ChannelInviteAcceptModal from "@src/components/modal/channel/channelInviteAcceptModal";
import FirstLoginModal from "@src/components/modal/login/firstLoginModal";

export interface NavBarPropsType {
  currentPath: string;
}

const NavBar = () => {
  const [showProfile] = useRecoilState(showProfileState);
  const [battleActionModal] = useRecoilState(battleActionModalState);
  const [gameAlertModal] = useRecoilState(gameAlertModalState);
  const channelInvite = useRecoilValue(channelInviteAcceptModalState);
  const [isFirstLogin, setIsFirstLogin] =
    useRecoilState<boolean>(isFirstLoginState);

  // useEffect(() => {
  //   if (isFirstLogin) {
  //     setShowLoginSuccessModal(true);
  //     console.log("here");
  //     setTimeout(() => {
  //       setShowLoginSuccessModal(false);
  //     }, 5000);
  //     setIsFirstLogin(false);
  //   }
  // }, [isFirstLogin]);
  // const currentPath = window.location.pathname;
  // useEffect(() => {
  //   if (currentPath !== "/") return;

  // }, [currentPath]));

  return (
    <S.Container>
      <UpperTabList />
      <LowerTabList />
      {/* 아래는 모달 적용 영역입니다 */}
      <SettingOptionModal />
      {showProfile && <ProfileModal />}
      {battleActionModal.battleActionModal && <BattleActionModal />}
      {gameAlertModal.gameAlertModal && <GameAlertModal />}
      {channelInvite && <ChannelInviteAcceptModal />}
      <FirstLoginModal isOpen={isFirstLogin} setIsOpen={setIsFirstLogin} />
    </S.Container>
  );
};

export default NavBar;
