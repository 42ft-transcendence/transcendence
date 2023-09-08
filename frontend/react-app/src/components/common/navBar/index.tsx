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
import { useEffect } from "react";
import useInitializeState from "@src/hooks/useInitializeState";
import { gameRoomURLState } from "@src/recoil/atoms/game";

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
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const initializer = useInitializeState();

  useEffect(() => {
    if (!isFirstLogin) return;
    // TODO: 첫 접속일 때, 이전의 전역 상태 초기화
    initializer();
    // TODO: 첫 접속일 때, 모달 띄워준 뒤 첫 접속 상태 변경
    setTimeout(() => {
      setIsFirstLogin(false);
    }, 5000);
    // ! 만약 게임 URL이 남아있다면, 그 방이 남아있는지 확인
    setGameRoomURL("");
    // ? 남아있는데 대기중이라면 게임방으로 이동시키기
    // ? 남아있지 않다면 게임 유무 판단(가장 최근 전적이 몰수패라면 연결이 끊겼다고 판단할 수 있을듯함)으로 기록으로 이동하시겠습니까? or 그냥 기본 동작
  }, [isFirstLogin]);

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
