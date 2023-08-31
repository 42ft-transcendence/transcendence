import {
  ButtonList,
  IconButtonProps,
  ButtonHander,
} from "@src/components/buttons";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useNavigate } from "react-router-dom";
import { logout, resignUser } from "@src/api";
import {
  ProfileImage,
  ProfileImageContainer,
} from "@src/pages/signUp/index.styled";
import { useState } from "react";
import { ChangeProfileImageModal } from "./container";
import { UserType } from "@src/types";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";

interface ProfileSideBarProps {
  user: UserType;
}

const ProfileSideBar = ({ user }: ProfileSideBarProps) => {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const currentRoute = window.location.pathname;
  const userId = currentRoute.split("/").pop();
  const navigate = useNavigate();

  const myProfileButtons: IconButtonProps[] = [
    {
      title: "프로필 변경",
      iconSrc: "",
      onClick: () => {
        console.log("프로필 변경");
        setChangeImage(true);
      },
      theme: "LIGHT",
    },
    {
      title: "로그아웃",
      iconSrc: "",
      onClick: () => {
        ButtonHander({ todo: logout, navigate: navigate });
      },
      theme: "LIGHT",
    },
    {
      title: "회원탈퇴",
      iconSrc: "",
      onClick: () => {
        ButtonHander({ todo: resignUser, navigate: navigate });
      },
      theme: "LIGHT",
    },
  ];

  const othersProfileButtons: IconButtonProps[] = [
    {
      title: "대전 신청",
      iconSrc: "",
      onClick: () => {
        console.log("대전 신청");
      },
      theme: "LIGHT",
    },
    {
      title: "DM 보내기",
      iconSrc: "",
      onClick: () => {
        console.log("DM 보내기");
      },
      theme: "LIGHT",
    },
    {
      title: "차단하기",
      iconSrc: "",
      onClick: () => {
        console.log("차단하기");
      },
      theme: "LIGHT",
    },
  ];

  // useEffect(() => {
  //   const temp = async () => {
  //     const friendList = await getFriendList();
  //     console.log("friendList", friendList);
  //   };
  //   temp();
  // }, []);

  let finalButtons: IconButtonProps[];
  if (userData.id === userId) {
    finalButtons = myProfileButtons;
  } else {
    finalButtons = othersProfileButtons;
    // console.log(allUserList);
    // const currentProfile = allUserList.find((user) => user.id === userId);
    // if (!currentProfile) return null;
    // setCurrentProfile(currentProfile);
    // const isFriend = await ; // 친구인지 여부를 판별하는 로직 필요
    // const isBlocked = false; // 차단했는지 여부를 판별하는 로직 필요

    // if (isFriend) {
    //   othersProfileButtons.push({
    //     title: "친구 삭제",
    //     iconSrc: "",
    //     onClick: () => {
    //       console.log("친구 삭제");
    //     },
    //     theme: "LIGHT",
    //   });
    // } else {
    //   othersProfileButtons.push({
    //     title: "친구신청",
    //     iconSrc: "",
    //     onClick: () => {
    //       console.log("친구신청");
    //     },
    //     theme: "LIGHT",
    //   });
    // }

    // if (isBlocked) {
    //   const blockButtonIndex = othersProfileButtons.findIndex(
    //     (button) => button.title === "차단하기",
    //   );
    //   if (blockButtonIndex !== -1) {
    //     othersProfileButtons[blockButtonIndex].title = "차단 해제";
    //     othersProfileButtons[blockButtonIndex].onClick = () => {
    //       console.log("차단 해제");
    //     };
    //   }
    // }
  }

  return (
    <DS.Container style={{ gap: "20px" }}>
      <ProfileImageContainer>
        <ProfileImage
          src={user.avatarPath}
          alt="profile image"
          style={{ cursor: "default" }}
        />
      </ProfileImageContainer>
      <S.NicknameContainer>
        <S.NicknameText>{user.nickname}</S.NicknameText>
        <S.PencilIcon
          src={`../src/assets/icons/pencil_freezePurple.svg`}
          alt="level"
        />
      </S.NicknameContainer>
      <RateDoughnutChart userData={user} />
      <ButtonList buttons={finalButtons} />
      {changeImage && (
        <ChangeProfileImageModal
          changeImage={changeImage}
          setChangeImage={setChangeImage}
          setUserData={setUserData}
        />
      )}
    </DS.Container>
  );
};

export default ProfileSideBar;
