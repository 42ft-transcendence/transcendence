import { DoubleTextButtonProps, ButtonList } from "@src/components/buttons";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";

const UserListSideBar = () => {
  const [allUserList] = useRecoilState(allUserListState);

  // TODO: text2에 "0"인 경우는 추가 구현 사항
  const userButtonList: DoubleTextButtonProps[] = [
    {
      text1: "전체",
      text2: `${allUserList.length.toString()}`,
      onClick: () => {
        console.log("전체 유저 리스트 불러오기");
      },
      theme: "LIGHT",
    },
    {
      text1: "친구",
      text2: "0",
      onClick: () => {
        console.log("친구 리스트 불러오기");
      },
      theme: "LIGHT",
    },
  ];

  const userStatusButtonList: DoubleTextButtonProps[] = [
    {
      text1: "온라인",
      text2: "0",
      onClick: () => {
        console.log("온라인 유저 리스트 불러오기");
      },
      theme: "LIGHT",
    },
    {
      text1: "게임중",
      text2: "0",
      onClick: () => {
        console.log("게임중 유저 리스트 불러오기");
      },
      theme: "LIGHT",
    },
    {
      text1: "오프라인",
      text2: "0",
      onClick: () => {
        console.log("오프라인 유저 리스트 불러오기");
      },
      theme: "LIGHT",
    },
  ];

  return (
    <DS.Container style={{ gap: "20px" }}>
      <DS.TitleBox>사용자 둘러보기</DS.TitleBox>
      <ButtonList style={{ gap: "20px" }} buttons={userButtonList} />
      <DS.TitleBox>접속 현황</DS.TitleBox>
      <ButtonList style={{ gap: "20px" }} buttons={userStatusButtonList} />
    </DS.Container>
  );
};

export default UserListSideBar;
