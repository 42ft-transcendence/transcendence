import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserStatus, UserType } from "@src/types";
import {
  allUserListState,
  friendListState,
  showProfileState,
} from "@src/recoil/atoms/common";
import { getFriendList } from "@src/api";
import { UserStatusCounts } from "@src/types/user.type";
import { SearchComponent, UserCardComponent } from "./container";
import { ProfileModalOnClickHandler } from "@src/utils";

const UserList = () => {
  const [search, setSearch] = useState<string>("");
  const [userList] = useRecoilState<UserType[]>(allUserListState);
  const [filteredUserList, setFilteredUserList] = useState<UserType[]>([]);
  const [sortedUserList, setSortedUserList] = useState<UserType[]>([]);
  const [, setShowProfile] = useRecoilState(showProfileState);
  const [userStatusCounts, setUserStatusCounts] = useState<UserStatusCounts>({
    friendCount: 0,
    onlineCount: 0,
    gamingCount: 0,
    offlineCount: 0,
  });
  const [currentClick, setCurrentClick] = useState<string>("allUsers");
  const [sortState, setSortState] = useState<string>("닉네임 순");
  const [friendList, setFriendList] = useRecoilState(friendListState);

  const currentRoute = window.location.pathname;
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  useEffect(() => {
    getFriendList()
      .then(({ data }) => {
        setFriendList(data);
      })
      .catch((error) => {
        console.error("Error fetching the friend list:", error);
      });
  }, [setFriendList]);

  useEffect(() => {
    setUserStatusCounts({
      friendCount: friendList.length,
      onlineCount: userList.filter((user) => user.status === UserStatus.ONLINE)
        .length,
      gamingCount: userList.filter((user) => user.status === UserStatus.GAMING)
        .length,
      offlineCount: userList.filter(
        (user) => user.status === UserStatus.OFFLINE,
      ).length,
    });
  }, [userList, friendList]);

  useEffect(() => {
    const searchedUserList = userList.filter((user) =>
      user.nickname.includes(search),
    );
    if (currentClick === "allUsers") {
      setFilteredUserList(searchedUserList);
    } else if (currentClick === "online") {
      setFilteredUserList(
        searchedUserList.filter((user) => user.status === UserStatus.ONLINE),
      );
    } else if (currentClick === "gaming") {
      setFilteredUserList(
        searchedUserList.filter((user) => user.status === UserStatus.GAMING),
      );
    } else if (currentClick === "offline") {
      setFilteredUserList(
        searchedUserList.filter((user) => user.status === UserStatus.OFFLINE),
      );
    } else if (currentClick === "friends") {
      setFilteredUserList(
        searchedUserList.filter((user) =>
          friendList.some((friend) => friend.id === user.id),
        ),
      );
    }
  }, [userList, friendList, search, currentClick]);

  useEffect(() => {
    if (sortState === "닉네임 순") {
      setSortedUserList(
        [...filteredUserList].sort((a, b) =>
          a.nickname.localeCompare(b.nickname),
        ),
      );
    } else if (sortState === "랭크 점수 순") {
      setSortedUserList(
        [...filteredUserList].sort((a, b) => b.rating - a.rating),
      );
    }
  }, [filteredUserList, sortState]);

  const handleOnAllUsersClick = () => {
    setCurrentClick("allUsers");
    setSortState("닉네임 순");
  };

  const handleOnFriendsClick = async () => {
    setCurrentClick("friends");
    setSortState("닉네임 순");
  };

  const handleOnStatusClick = (current: string) => () => {
    setCurrentClick(current);
    setSortState("닉네임 순");
  };

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent
        onAllUsersClick={handleOnAllUsersClick}
        onFriendsClick={handleOnFriendsClick}
        onOnlineClick={handleOnStatusClick("online")}
        onGamingClick={handleOnStatusClick("gaming")}
        onOfflineClick={handleOnStatusClick("offline")}
        userStatusCounts={userStatusCounts}
        currentClick={currentClick}
      />
      <DS.ContentArea style={{ overflowX: "scroll" }}>
        <SearchComponent
          id="userListSearch"
          search={search}
          setSearch={setSearch}
          sortState={sortState}
          setSortState={setSortState}
        />
        <S.UserCardContainer>
          {sortedUserList.map((user) => (
            <UserCardComponent
              key={user.id}
              avatarPath={user.avatarPath}
              status={user.status}
              nickname={user.nickname}
              rating={user.rating}
              onClick={ProfileModalOnClickHandler(setShowProfile, true, user)}
            />
          ))}
        </S.UserCardContainer>
      </DS.ContentArea>
    </>
  );
};

export default UserList;
