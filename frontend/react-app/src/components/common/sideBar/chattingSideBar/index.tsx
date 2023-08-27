import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import { useRecoilState } from "recoil";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";

const ChattingSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const [, setShowProfile] = useRecoilState(showProfileState);

  const iconButtons: IconButtonProps[] = [
    {
      title: "채널 생성",
      iconSrc: "",
      onClick: () => {
        console.log("채널 생성");
      },
      theme: "LIGHT",
    },
    {
      title: "채널 탈퇴",
      iconSrc: "",
      onClick: () => {
        console.log("채널 탈퇴");
      },
      theme: "LIGHT",
    },
    {
      title: "채널 탐색",
      iconSrc: "",
      onClick: () => {
        console.log("채널 탐색");
      },
      theme: "LIGHT",
    },
    {
      title: "프로필 모달 테스트",
      iconSrc: "",
      onClick: () => {
        setShowProfile({
          showProfile: true,
          user: userData,
        });
      },
      theme: "LIGHT",
    },
  ];

  return (
    <S.Container>
      <ButtonList buttons={iconButtons} />
    </S.Container>
  );
};

export default ChattingSideBar;
