import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";

const ChattingSideBar = () => {
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
  ];

  return (
    <S.Container>
      <ButtonList buttons={iconButtons} />
    </S.Container>
  );
};

export default ChattingSideBar;
