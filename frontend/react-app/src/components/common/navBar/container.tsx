import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { settingOptionModalState } from "@src/recoil/atoms/modal";
import { logout, resignUser } from "@src/api";
import { Link, useNavigate } from "react-router-dom";
import { ButtonHander } from "@src/components/buttons";
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
import { useEffect, useState } from "react";
import { gameRoomInfoState } from "@src/recoil/atoms/game";

export type TabType = {
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

export const UpperTabList = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const currentPath = window.location.pathname.split("/")[1];
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);

  const handleTabClick = (link: string) => {
    setSelectedTab(link);
  };

  const getIconSrc = (tab: TabType) => {
    if (tab.child_links.includes(currentPath)) return tab.icon_selected;
    if (selectedTab === tab.link) return tab.icon_selected;
    if (hoveredTab === tab.link) return tab.icon_hovered;
    return tab.icon;
  };

  useEffect(() => {
    if (gameRoomInfo.roomURL !== "") {
      upperTabs.forEach((tab) => {
        if (tab.link === "/game-list") {
          tab.link = "/game/" + gameRoomInfo.roomURL;
        }
      });
    } else {
      upperTabs.forEach((tab) => {
        if (tab.link.includes("/game/")) {
          tab.link = "/game-list";
        }
      });
    }
  }, [gameRoomInfo.roomURL]);

  return (
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
  );
};

export const LowerTabList = () => {
  const [, setSettingOptionModalOpen] = useRecoilState(settingOptionModalState);
  const [userData] = useRecoilState(userDataState);
  const [isUserHovered, setUserHovered] = useState(false);
  const [isGearHovered, setGearHovered] = useState(false);
  const getUserIcon = () => (isUserHovered ? UserHovered : User);
  const getGearIcon = () => (isGearHovered ? GearHovered : Gear);

  const handleProfileClick = () => {
    window.location.href = `/profile/${userData.id}`;
    console.log("profile clicked");
  };

  const handleSettingClick = () => {
    console.log("setting clicked");
    setSettingOptionModalOpen(true);
  };

  return (
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
  );
};

Modal.setAppElement("#root");
export const SettingOptionModal = () => {
  const [settingOptionModalOpen, setSettingOptionModalOpen] =
    useRecoilState<boolean>(settingOptionModalState);
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={settingOptionModalOpen}
      onRequestClose={() => setSettingOptionModalOpen(false)}
      style={{
        content: { ...S.SettingOptionModalContent },
        overlay: { ...S.SettingOptionModalOverlay },
      }}
    >
      <S.SettingOptionModalContentWrapper>
        <S.SettingOptionModalButton
          title="로그아웃"
          onClick={() => ButtonHander({ todo: logout, navigate: navigate })}
        >
          로그아웃
        </S.SettingOptionModalButton>
        <S.SettingOptionModalDivider />
        <S.SettingOptionModalButton
          title="회원탈퇴"
          onClick={() => ButtonHander({ todo: resignUser, navigate: navigate })}
        >
          회원탈퇴
        </S.SettingOptionModalButton>
      </S.SettingOptionModalContentWrapper>
    </Modal>
  );
};
