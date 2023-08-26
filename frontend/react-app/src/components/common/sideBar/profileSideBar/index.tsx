import {
  IconButtonList,
  IconButtonProps,
  buttonHandler,
} from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useNavigate } from "react-router-dom";
import { logout, resignUser } from "@src/api";

const ProfileSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  console.log("userData", userData);

  const currentRoute = window.location.pathname;
  console.log("currentRoute", currentRoute);
  // currentRoute의 마지막 / 뒤에 있는 문자열을 가져옵니다.
  const userId = currentRoute.split("/").pop();
  console.log("userId", userId);
  console.log(userData.id === userId);

  const navigate = useNavigate();

  const myProfileButtons: IconButtonProps[] = [
    {
      title: "프로필 변경",
      iconSrc: "",
      onClick: () => {
        console.log("프로필 변경");
      },
      theme: "LIGHT",
    },
    {
      title: "로그아웃",
      iconSrc: "",
      onClick: () => {
        buttonHandler({ todo: logout, navigate: navigate });
      },
      theme: "LIGHT",
    },
    {
      title: "회원탈퇴",
      iconSrc: "",
      onClick: () => {
        buttonHandler({ todo: resignUser, navigate: navigate });
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
  const isFriend = false; // 친구인지 여부를 판별하는 로직 필요
  const isBlocked = false; // 차단했는지 여부를 판별하는 로직 필요

  if (isFriend) {
    othersProfileButtons.push({
      title: "친구 삭제",
      iconSrc: "",
      onClick: () => {
        console.log("친구 삭제");
      },
      theme: "LIGHT",
    });
  } else {
    othersProfileButtons.push({
      title: "친구신청",
      iconSrc: "",
      onClick: () => {
        console.log("친구신청");
      },
      theme: "LIGHT",
    });
  }

  if (isBlocked) {
    const blockButtonIndex = othersProfileButtons.findIndex(
      (button) => button.title === "차단하기",
    );
    if (blockButtonIndex !== -1) {
      othersProfileButtons[blockButtonIndex].title = "차단 해제";
      othersProfileButtons[blockButtonIndex].onClick = () => {
        console.log("차단 해제");
      };
    }
  }

  let finalButtons: IconButtonProps[];

  if (userData.id === userId) {
    finalButtons = myProfileButtons;
  } else {
    finalButtons = othersProfileButtons;
  }

  return (
    <S.Container>
      <IconButtonList iconButtons={finalButtons} />
    </S.Container>
  );
};

export default ProfileSideBar;
