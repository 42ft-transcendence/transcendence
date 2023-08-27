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

  const currentRoute = window.location.pathname;
  // currentRoute를 "/"로 분리한 뒤 첫번째 요소만 가져옴
  const currentRouteFirstElement = currentRoute.split("/")[1];

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // TODO: showProfile.showProfile가 false일 때 null을 반환
  if (!showProfile.showProfile) return null;

  // TODO: role을 설정하는 로직
  let role = "owner" as RoleType;
  if (showProfile.user.id === userData.id) {
    role = "self" as RoleType;
  } else {
    // currentRouteFirstElement가 "channel-list"가 아니라면 role을 "attendee"로 설정
    if (currentRouteFirstElement !== "channel-list") {
      role = "attendee" as RoleType;
    }
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
