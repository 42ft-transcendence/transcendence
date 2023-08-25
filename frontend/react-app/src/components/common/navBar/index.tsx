import * as S from "./index.styled";
import { Link } from "react-router-dom";
import Chat from "@assets/icons/Chats.svg";
import Game from "@assets/icons/GameController.svg";
import Rank from "@assets/icons/Trophy.svg";
import User from "@assets/icons/UserCircle.svg";
import Users from "@assets/icons/Users.svg";
import Gear from "@assets/icons/Gear.svg";
import ChatBlue from "@assets/icons/ChatsBlue.svg";
import GameBlue from "@assets/icons/GameControllerBlue.svg";
import RankBlue from "@assets/icons/TrophyBlue.svg";
import UserBlue from "@assets/icons/UserCircleBlue.svg";
import UsersBlue from "@assets/icons/UsersBlue.svg";
import GearBlue from "@assets/icons/GearBlue.svg";

export interface NavBarPropsType {
  currentPath: string;
}

const upperTabs = [
  {
    link: "/channel-list",
    icon: Chat,
    icon_selected: ChatBlue,
    child_links: ["channel", "channel-list", "directmessage"],
  },
  {
    link: "/game-list",
    icon: Game,
    icon_selected: GameBlue,
    child_links: ["game", "game-list", "game-detail"],
  },
  {
    link: "/ranking",
    icon: Rank,
    icon_selected: RankBlue,
    child_links: ["ranking"],
  },
  {
    link: "/user-list",
    icon: Users,
    icon_selected: UsersBlue,
    child_links: ["user-list"],
  },
];

const lowerTabs = [
  {
    link: "/profile",
    icon: User,
    icon_selected: UserBlue,
    child_links: ["profile"],
  },
  {
    link: "/setting",
    icon: Gear,
    icon_selected: GearBlue,
    child_links: ["setting"],
  },
];

const NavBar = () => {
  return (
    <S.Container>
      <S.TabList>
        {upperTabs.map((tab) => (
          <li key={tab.link}>
            <Link to={tab.link}>
              {tab.child_links.includes(
                window.location.pathname.split("/")[1],
              ) ? (
                <S.ItemIcon src={tab.icon_selected} />
              ) : (
                <S.ItemIcon src={tab.icon} />
              )}
            </Link>
          </li>
        ))}
      </S.TabList>
      <S.TabList>
        {lowerTabs.map((tab) => (
          <li key={tab.link}>
            <Link to={tab.link}>
              {tab.child_links.includes(
                window.location.pathname.split("/")[1],
              ) ? (
                <S.ItemIcon src={tab.icon_selected} />
              ) : (
                <S.ItemIcon src={tab.icon} />
              )}
            </Link>
          </li>
        ))}
      </S.TabList>
    </S.Container>
  );
};

export default NavBar;
