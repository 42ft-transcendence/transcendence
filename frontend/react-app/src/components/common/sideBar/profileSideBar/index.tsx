import {
  ButtonList,
  IconButtonProps,
  ButtonHandler,
} from "@src/components/buttons";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allUserListState,
  isFirstLoginState,
  userDataState,
} from "@src/recoil/atoms/common";
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
import { changeNicknameModalState } from "@src/recoil/atoms/modal";
import { ChangeNicknameModal } from "@src/components/modal/profile/changeNickname";
import {
  secondAuthActivateModalState,
  secondAuthDeactivateModalState,
} from "@src/recoil/atoms/modal";
import SecondAuthActivateModal from "@src/components/modal/auth/secondAuthActivateModal";
import SecondAuthDeactivateModal from "@src/components/modal/auth/secondAuthDeactivateModal";
import { gameSocket } from "@src/router/socket/gameSocket";
import { SHA256 } from "crypto-js";

interface ProfileSideBarProps {
  user: UserType;
}

const ProfileSideBar = ({ user }: ProfileSideBarProps) => {
  const allUserList = useRecoilValue(allUserListState);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const [is2FaActivateModalOpened, set2FaActivateModal] = useRecoilState(
    secondAuthActivateModalState,
  );
  const [is2FaDeactivateModalOpened, set2FaDeactivateModal] = useRecoilState(
    secondAuthDeactivateModalState,
  );
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [finalButtons, setFinalButtons] = useState<IconButtonProps[]>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const currentRoute = window.location.pathname;
  const userId = currentRoute.split("/").pop() as string;
  const navigate = useNavigate();
  const [changeNicknameModal, setChangeNicknameModal] = useRecoilState(
    changeNicknameModalState,
  );

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
        ButtonHandler({
          todo: logout,
          navigate: navigate,
          setIsFirstLogin: setIsFirstLogin,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "회원탈퇴",
      iconSrc: "",
      onClick: () => {
        ButtonHandler({
          todo: resignUser,
          navigate: navigate,
          setIsFirstLogin: setIsFirstLogin,
        });
      },
      theme: "LIGHT",
    },
  ];

  const hashTitle = (title: string): string => {
    const hash = SHA256(title);
    return hash.toString(); // 해시 값을 문자열로 반환
  };

  const handleBattleOffer = (): void => {
    try {
      const currentTime: Date = new Date();
      console.log("대전신청");
      const roomURL = currentTime + userData.id;
      const hashedTitle = hashTitle(roomURL);
      const awayUser = allUserList.find((user) => user.id === userId);
      gameSocket.emit("offerBattle", {
        awayUser: awayUser,
        myData: userData,
        gameRoomURL: hashedTitle,
        roomType: "PRIVATE",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const othersProfileButtons: IconButtonProps[] = [
    {
      title: "대전 신청",
      iconSrc: "",
      onClick: handleBattleOffer,
      theme: "LIGHT",
    },
    {
      title: "DM 보내기",
      iconSrc: "",
      onClick: () => {
        navigate(`/direct-message/${userId}`);
      },
      theme: "LIGHT",
    },
  ];

  useEffect(() => {
    const isRelationship = async () => {
      if (userData.id === userId) {
        const twoFactorButton: IconButtonProps =
          userData.isTwoFactorAuthenticationEnabled
            ? {
                title: "2차 인증 비활성화",
                iconSrc: "",
                onClick: () => {
                  set2FaDeactivateModal(true);
                },
                theme: "LIGHT",
              }
            : {
                title: "2차 인증 활성화",
                iconSrc: "",
                onClick: () => {
                  set2FaActivateModal(true);
                },
                theme: "LIGHT",
              };
        setFinalButtons([...myProfileButtons, twoFactorButton]);
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
  }, [
    isFriend,
    isBlocked,
    userData,
    userId,
    set2FaDeactivateModal,
    set2FaActivateModal,
  ]);

  return (
    <>
      {is2FaActivateModalOpened && <SecondAuthActivateModal />}
      {is2FaDeactivateModalOpened && <SecondAuthDeactivateModal />}
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
            title="닉네임 변경"
            src={`../src/assets/icons/pencil_freezePurple.svg`}
            alt="level"
            onClick={() => {
              setChangeNicknameModal(true);
            }}
            style={{ cursor: "pointer" }}
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
        {changeNicknameModal && <ChangeNicknameModal />}
      </DS.Container>
    </>
  );
};

export default ProfileSideBar;
