import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import SearchIcon from "@assets/icons/MagnifyingGlass.svg";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserStatus, UserType } from "@src/types";
import {
  allUserListState,
  filteredUserListState,
} from "@src/recoil/atoms/common";
import { getFriendList } from "@src/api";
import { UserStatusCounts } from "@src/types/user.type";

const UserList = () => {
  const [search, setSearch] = useState<string>("");
  const [userList] = useRecoilState<UserType[]>(allUserListState);
  const [filteredUserList, setFilteredUserList] = useRecoilState<UserType[]>(
    filteredUserListState,
  );
  const [userStatusCounts, setUserStatusCounts] = useState<UserStatusCounts>({
    friendCount: 0,
    onlineCount: 0,
    gamingCount: 0,
    offlineCount: 0,
  });
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
  }, [userList, setFilteredUserList]);

  const handleOnAllUsersClick = () => {
    setFilteredUserList(userList);
  };

  const handleOnFriendsClick = async () => {
    const response = await getFriendList();
    const friendList = response.data;
    setFilteredUserList(friendList);
  };

  const handleOnStatusClick = (userStatus: UserStatus) => {
    setFilteredUserList(userList.filter((user) => user.status === userStatus));
  };

  useEffect(() => {
    console.log("search", search);
  }, [search]);

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent
        onAllUsersClick={handleOnAllUsersClick}
        onFriendsClick={handleOnFriendsClick}
        onOnlineClick={handleOnStatusClick(UserStatus.ONLINE)}
        onGamingClick={handleOnStatusClick(UserStatus.GAMING)}
        onOfflineClick={handleOnStatusClick(UserStatus.OFFLINE)}
        userStatusCounts={userStatusCounts}
      />
      <DS.ContentArea>
        <S.SearchBarContainer>
          <S.SearchBar>
            <S.SearchBarInput
              type="text"
              placeholder="유저 닉네임 검색"
              maxLength={10}
              id="nickname"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <S.SearchBarImg src={SearchIcon} />
          </S.SearchBar>
        </S.SearchBarContainer>
        <S.UserCardContainer>
          <S.UserCard></S.UserCard>
        </S.UserCardContainer>
      </DS.ContentArea>
    </>
  );
};

export default UserList;
