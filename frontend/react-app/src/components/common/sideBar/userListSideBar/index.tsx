import { DoubleTextButtonProps, ButtonList } from "@src/components/buttons";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { UserStatusCounts } from "@src/types/user.type";
import { createDummy } from "@src/api";
import { createDummyHistory } from "@src/recoil/atoms/game/createDummyHistory";
import { matchHistoryListState } from "@src/recoil/atoms/game";

interface UserListSideBarProps {
  onAllUsersClick: () => void;
  onFriendsClick: () => void;
  onOnlineClick: () => void;
  onGamingClick: () => void;
  onOfflineClick: () => void;
  userStatusCounts: UserStatusCounts;
  currentClick: string;
}

const UserListSideBar: React.FC<UserListSideBarProps> = ({
  onAllUsersClick,
  onFriendsClick,
  onOnlineClick,
  onGamingClick,
  onOfflineClick,
  userStatusCounts,
  currentClick,
}) => {
  const [allUserList] = useRecoilState(allUserListState);
  const [, setMatchHistoryList] = useRecoilState(matchHistoryListState);

  // TODO: text2에 "0"인 경우는 추가 구현 사항
  const userButtonList: DoubleTextButtonProps[] = [
    {
      text1: "전체",
      text2: `${allUserList.length.toString()}`,
      onClick: onAllUsersClick,
      theme: currentClick === "allUsers" ? "DARK" : "LIGHT",
    },
    {
      text1: "친구",
      text2: `${userStatusCounts.friendCount.toString()}`,
      onClick: onFriendsClick,
      theme: currentClick === "friends" ? "DARK" : "LIGHT",
    },
  ];

  const userStatusButtonList: DoubleTextButtonProps[] = [
    {
      text1: "온라인",
      text2: `${userStatusCounts.onlineCount.toString()}`,
      onClick: onOnlineClick,
      theme: currentClick === "online" ? "DARK" : "LIGHT",
    },
    {
      text1: "게임중",
      text2: `${userStatusCounts.gamingCount.toString()}`,
      onClick: onGamingClick,
      theme: currentClick === "gaming" ? "DARK" : "LIGHT",
    },
    {
      text1: "오프라인",
      text2: `${userStatusCounts.offlineCount.toString()}`,
      onClick: onOfflineClick,
      theme: currentClick === "offline" ? "DARK" : "LIGHT",
    },
  ];

  const dummyUserButtonList: DoubleTextButtonProps[] = [
    {
      text1: "더미 유저 생성",
      text2: "50",
      onClick: async () => {
        await createDummy(50);
      },
      theme: "LIGHT",
    },
    {
      text1: "더미 전적 생성",
      text2: "5000",
      onClick: () => {
        console.log("더미 전적 생성");
        console.log(
          "createDummyHistory",
          createDummyHistory(allUserList, 5000),
        );
        const dummyHistory = createDummyHistory(allUserList, 5000);
        setMatchHistoryList(dummyHistory);
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
      <DS.TitleBox>더미 유저 생성</DS.TitleBox>
      <ButtonList style={{ gap: "20px" }} buttons={dummyUserButtonList} />
    </DS.Container>
  );
};

export default UserListSideBar;
