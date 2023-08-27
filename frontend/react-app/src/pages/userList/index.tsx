import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserStatus, UserType } from "@src/types";
import {
  allUserListState,
  filteredUserListState,
  showProfileState,
} from "@src/recoil/atoms/common";
import { getFriendList } from "@src/api";
import { UserStatusCounts } from "@src/types/user.type";
import { SearchComponent, UserCardComponent } from "./container";

const UserList = () => {
  const [search, setSearch] = useState<string>("");
  const [userList] = useRecoilState<UserType[]>(allUserListState);
  const [filteredUserList, setFilteredUserList] = useRecoilState<UserType[]>(
    filteredUserListState,
  );
  const [, setShowProfile] = useRecoilState(showProfileState);
  const [preSearchFilteredList, setPreSearchFilteredList] = useState<
    UserType[]
  >([...filteredUserList].sort((a, b) => a.nickname.localeCompare(b.nickname)));
  const [userStatusCounts, setUserStatusCounts] = useState<UserStatusCounts>({
    friendCount: 0,
    onlineCount: 0,
    gamingCount: 0,
    offlineCount: 0,
  });
  const [currentClick, setCurrentClick] = useState<string>("allUsers");
  const [sortState, setSortState] = useState<string>("닉네임 순");

  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  useEffect(() => {
    const fetchData = async () => {
      setFilteredUserList([...userList]);

      try {
        await getFriendList().then((res) => {
          setUserStatusCounts({
            friendCount: res.data.length,
            onlineCount: userList.filter(
              (user) => user.status === UserStatus.ONLINE,
            ).length,
            gamingCount: userList.filter(
              (user) => user.status === UserStatus.GAMING,
            ).length,
            offlineCount: userList.filter(
              (user) => user.status === UserStatus.OFFLINE,
            ).length,
          });
        });
      } catch (error) {
        console.error("Error fetching the friend list:", error);
      }
    };

    fetchData();
  }, [userList]);

  useEffect(() => {
    console.log("search", search);

    if (search === "") {
      setFilteredUserList([...preSearchFilteredList]);
      return;
    }

    const updatedList = preSearchFilteredList.filter((user) =>
      user.nickname.includes(search),
    );
    setFilteredUserList(updatedList);
  }, [search, preSearchFilteredList]);

  useEffect(() => {
    if (sortState === "닉네임 순") {
      setFilteredUserList(
        [...filteredUserList].sort((a, b) =>
          a.nickname.localeCompare(b.nickname),
        ),
      );
    } else if (sortState === "랭크 점수 순") {
      setFilteredUserList(
        [...filteredUserList].sort((a, b) => b.rating - a.rating),
      );
    }
  }, [sortState]);

  const handleOnAllUsersClick = () => {
    setFilteredUserList(userList);
    setPreSearchFilteredList(
      [...userList].sort((a, b) => a.nickname.localeCompare(b.nickname)),
    );
    setCurrentClick("allUsers");
    setSortState("닉네임 순");
  };

  const handleOnFriendsClick = async () => {
    const response = await getFriendList();
    const friendList = response.data;
    setFilteredUserList(friendList);
    setPreSearchFilteredList(
      [...friendList].sort((a, b) => a.nickname.localeCompare(b.nickname)),
    );
    setCurrentClick("friends");
    setSortState("닉네임 순");
  };

  const handleOnStatusClick =
    (userStatus: UserStatus, current: string) => () => {
      setFilteredUserList(
        userList.filter((user) => user.status === userStatus),
      );
      setPreSearchFilteredList(
        [...userList.filter((user) => user.status === userStatus)].sort(
          (a, b) => a.nickname.localeCompare(b.nickname),
        ),
      );
      setCurrentClick(current);
      setSortState("닉네임 순");
    };

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent
        onAllUsersClick={handleOnAllUsersClick}
        onFriendsClick={handleOnFriendsClick}
        onOnlineClick={handleOnStatusClick(UserStatus.ONLINE, "online")}
        onGamingClick={handleOnStatusClick(UserStatus.GAMING, "gaming")}
        onOfflineClick={handleOnStatusClick(UserStatus.OFFLINE, "offline")}
        userStatusCounts={userStatusCounts}
        currentClick={currentClick}
      />
      <DS.ContentArea>
        <SearchComponent
          search={search}
          setSearch={setSearch}
          sortState={sortState}
          setSortState={setSortState}
        />
        <S.UserCardContainer>
          {filteredUserList.map((user) => (
            <UserCardComponent
              key={user.id}
              avatarPath={user.avatarPath}
              status={user.status}
              nickname={user.nickname}
              rating={user.rating}
              onClick={() => {
                setShowProfile({
                  showProfile: true,
                  user: user,
                });
              }}
            />
          ))}
        </S.UserCardContainer>
      </DS.ContentArea>
    </>
  );
};

export default UserList;
