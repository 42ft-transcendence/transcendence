import * as S from "./index.styled";
import { Link, useNavigate } from "react-router-dom";
import Chat from "@assets/icons/ChatsDarkFreezePurple.svg";
import Game from "@assets/icons/GameControllerDarkFreezePurple.svg";
import Rank from "@assets/icons/TrophyDarkFreezePurple.svg";
import Users from "@assets/icons/UsersDarkFreezePurple.svg";
import Gear from "@assets/icons/GearDarkFreezePurple.svg";
import User from "@assets/icons/UserCircleDarkFreezePurple.svg";
import ChatBlue from "@assets/icons/ChatsBlue.svg";
import GameBlue from "@assets/icons/GameControllerBlue.svg";
import RankBlue from "@assets/icons/TrophyBlue.svg";
import UsersBlue from "@assets/icons/UsersBlue.svg";
import ChatHovered from "@assets/icons/Chats.svg";
import GameHovered from "@assets/icons/GameController.svg";
import RankHovered from "@assets/icons/Trophy.svg";
import UsersHovered from "@assets/icons/Users.svg";
import UserHovered from "@assets/icons/UserCircle.svg";
import GearHovered from "@assets/icons/Gear.svg";
import { useRecoilState } from "recoil";
import { settingOptionModalState } from "@recoil/atoms/modal";
import { SettingOptionModal } from "./container";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import ProfileModal from "@src/components/modal/profile";
import { useState } from "react";

export interface NavBarPropsType {
  currentPath: string;
}

type TabType = {
  link: string;
  icon: string;
  icon_hovered: string;
  icon_selected: string;
  child_links: string[];
};

const upperTabs: TabType[] = [
  {
    link: "/channel-list",
    icon: Chat,
    icon_hovered: ChatHovered,
    icon_selected: ChatBlue,
    child_links: ["", "channel", "channel-list", "directmessage"],
  },
  {
    link: "/game-list",
    icon: Game,
    icon_hovered: GameHovered,
    icon_selected: GameBlue,
    child_links: ["game", "game-list", "game-detail"],
  },
  {
    link: "/ranking",
    icon: Rank,
    icon_hovered: RankHovered,
    icon_selected: RankBlue,
    child_links: ["ranking"],
  },
  {
    link: "/user-list",
    icon: Users,
    icon_hovered: UsersHovered,
    icon_selected: UsersBlue,
    child_links: ["user-list"],
  },
];

const NavBar = () => {
  const [, setSettingOptionModalOpen] = useRecoilState(settingOptionModalState);
  const [userData] = useRecoilState(userDataState);
  const [showProfile] = useRecoilState(showProfileState);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const currentPath = window.location.pathname.split("/")[1];
  const [isUserHovered, setUserHovered] = useState(false);
  const [isGearHovered, setGearHovered] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (link: string) => {
    setSelectedTab(link);
  };

  const getIconSrc = (tab: TabType) => {
    if (tab.child_links.includes(currentPath)) return tab.icon_selected;
    if (selectedTab === tab.link) return tab.icon_selected;
    if (hoveredTab === tab.link) return tab.icon_hovered;
    return tab.icon;
  };

  const getUserIcon = () => (isUserHovered ? UserHovered : User);
  const getGearIcon = () => (isGearHovered ? GearHovered : Gear);

  const handleProfileClick = () => {
    navigate(`/profile/${userData.id}`);
    console.log("profile clicked");
  };

  const handleSettingClick = () => {
    console.log("setting clicked");
    setSettingOptionModalOpen(true);
  };

  return (
    <S.Container>
      <S.TabList>
        {upperTabs.map((tab) => (
          <li
            key={tab.link}
            onMouseEnter={() => setHoveredTab(tab.link)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => handleTabClick(tab.link)}
          >
            <Link to={tab.link}>
              <S.ItemIcon src={getIconSrc(tab)} />
            </Link>
          </li>
        ))}
      </S.TabList>
      <S.TabList>
        <li
          onMouseEnter={() => setUserHovered(true)}
          onMouseLeave={() => setUserHovered(false)}
        >
          <button onClick={handleProfileClick}>
            <S.ItemIcon src={getUserIcon()} />
          </button>
        </li>
        <li
          onMouseEnter={() => setGearHovered(true)}
          onMouseLeave={() => setGearHovered(false)}
        >
          <button onClick={handleSettingClick}>
            <S.ItemIcon src={getGearIcon()} />
          </button>
        </li>
      </S.TabList>
      {/* 아래는 모달 적용 영역입니다 */}
      <SettingOptionModal />
      {showProfile && <ProfileModal />}
    </S.Container>
  );
};

export default NavBar;
