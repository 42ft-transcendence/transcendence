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
import {
  addBlock,
  addFriend,
  deleteBlock,
  deleteFriend,
  getBlockList,
  getFriendList,
  logout,
  resignUser,
} from "@src/api";
import {
  ProfileImage,
  ProfileImageContainer,
} from "@src/pages/signUp/index.styled";
import { useEffect, useState } from "react";
import { ChangeProfileImageModal } from "./container";
import { UserType } from "@src/types";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
// import {
//   secondAuthActivateModalState,
//   secondAuthDeactivateModalState,
// } from "@src/recoil/atoms/modal";
// import SecondAuthActivateModal from "@src/components/modal/auth/secondAuthActivateModal";
// import SecondAuthDeactivateModal from "@src/components/modal/auth/secondAuthDeactivateModal";

interface ProfileSideBarProps {
  user: UserType;
}

const ProfileSideBar = ({ user }: ProfileSideBarProps) => {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [finalButtons, setFinalButtons] = useState<IconButtonProps[]>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const currentRoute = window.location.pathname;
  const userId = currentRoute.split("/").pop() as string;
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
  ];

  useEffect(() => {
    const isRelationship = async () => {
      if (userData.id === userId) {
        setFinalButtons(myProfileButtons);
      } else {
        setFinalButtons(othersProfileButtons);
        const { data: friendList } = await getFriendList();
        const { data: blockList } = await getBlockList();

        setIsFriend(
          friendList.find((friend: UserType) => friend.id === userId) !==
            undefined,
        );
        setIsBlocked(
          blockList.find((blocked: UserType) => blocked.id === userId) !==
            undefined,
        );
        if (isFriend && !isBlocked) {
          setFinalButtons((prevButtons) => [
            ...prevButtons,
            {
              title: "친구 삭제",
              iconSrc: "",
              onClick: async () => {
                await deleteFriend(userId);
                setIsFriend(false);
              },
              theme: "LIGHT",
            },
          ]);
        } else {
          setFinalButtons((prevButtons) => [
            ...prevButtons,
            {
              title: "친구 추가",
              iconSrc: "",
              onClick: async () => {
                await addFriend(userId);
                setIsFriend(true);
              },
              theme: "LIGHT",
            },
          ]);
        }
        if (isBlocked) {
          setFinalButtons((prevButtons) => [
            ...prevButtons,
            {
              title: "차단 해제",
              iconSrc: "",
              onClick: async () => {
                await deleteBlock(userId);
                setIsBlocked(false);
              },
              theme: "LIGHT",
            },
          ]);
          setFinalButtons((prevButtons) =>
            prevButtons.filter((button) => button.title !== "친구 삭제"),
          );
          setFinalButtons((prevButtons) =>
            prevButtons.filter((button) => button.title !== "친구 추가"),
          );
        } else {
          setFinalButtons((prevButtons) => [
            ...prevButtons,
            {
              title: "차단 하기",
              iconSrc: "",
              onClick: async () => {
                await addBlock(userId);
                setIsBlocked(true);
              },
              theme: "LIGHT",
            },
          ]);
        }
      }
    };
    isRelationship();
  }, [isFriend, isBlocked]);

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
