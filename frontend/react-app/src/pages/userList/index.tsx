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
  const [preSearchFilteredList, setPreSearchFilteredList] =
    useState<UserType[]>(filteredUserList);
  const [userStatusCounts, setUserStatusCounts] = useState<UserStatusCounts>({
    friendCount: 0,
    onlineCount: 0,
    gamingCount: 0,
    offlineCount: 0,
  });
  const [currentClick, setCurrentClick] = useState<string>("allUsers");

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

  const handleOnAllUsersClick = () => {
    setFilteredUserList(userList);
    setPreSearchFilteredList(userList);
    setCurrentClick("allUsers");
  };

  const handleOnFriendsClick = async () => {
    const response = await getFriendList();
    const friendList = response.data;
    setFilteredUserList(friendList);
    setPreSearchFilteredList(friendList);
    setCurrentClick("friends");
  };

  const handleOnStatusClick =
    (userStatus: UserStatus, current: string) => () => {
      setFilteredUserList(
        userList.filter((user) => user.status === userStatus),
      );
      setPreSearchFilteredList(
        userList.filter((user) => user.status === userStatus),
      );
      setCurrentClick(current);
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
        <SearchComponent search={search} setSearch={setSearch} />
        <S.UserCardContainer>
          {filteredUserList.map((user) => (
            <UserCardComponent
              key={user.id}
              avatarPath={user.avatarPath}
              status={user.status}
              nickname={user.nickname}
              rating={user.rating}
            />
          ))}
        </S.UserCardContainer>
      </DS.ContentArea>
    </>
  );
};

export default UserList;
