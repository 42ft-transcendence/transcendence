import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { LowerTabList, SettingOptionModal, UpperTabList } from "./container";
import { showProfileState } from "@src/recoil/atoms/common";
import ProfileModal from "@src/components/modal/profile";

export interface NavBarPropsType {
  currentPath: string;
}

const NavBar = () => {
  const [showProfile] = useRecoilState(showProfileState);

  return (
    <S.Container>
      <UpperTabList />
      <LowerTabList />
      {/* 아래는 모달 적용 영역입니다 */}
      <SettingOptionModal />
      {showProfile && <ProfileModal />}
    </S.Container>
  );
};

export default NavBar;
