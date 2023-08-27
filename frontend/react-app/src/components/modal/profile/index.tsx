import { useRecoilState } from "recoil";
import {
  ProfileButtonContainer,
  ProfileContainer,
  ProfileImage,
  ProfileNickname,
  ProfileWrapper,
} from "./index.styled";
import { ProfileButtonActions } from "./container";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { RoleType, UserType } from "@src/types";

const ProfileModal = () => {
  const [userData] = useRecoilState(userDataState);
  const [showProfile, setShowProfile] = useRecoilState(showProfileState);

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // TODO: showProfile.showProfile가 false일 때 null을 반환
  if (!showProfile.showProfile) return null;

  let role = "owner" as RoleType;
  if (showProfile.user.id === userData.id) {
    role = "self" as RoleType;
  }

  return (
    <ProfileWrapper
      onClick={() => {
        setShowProfile({
          showProfile: false,
          user: {} as UserType,
        });
      }}
    >
      <ProfileContainer onClick={handleClickInside}>
        <ProfileImage src={showProfile.user.avatarPath} />
        <ProfileNickname>{showProfile.user.nickname}</ProfileNickname>
        <RateDoughnutChart userData={showProfile.user} />
        <ProfileButtonContainer>
          <ProfileButtonActions role={role} />
        </ProfileButtonContainer>
      </ProfileContainer>
    </ProfileWrapper>
  );
};

export default ProfileModal;
