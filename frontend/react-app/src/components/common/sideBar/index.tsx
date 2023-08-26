import { DefaultSideBar } from "./defaultSideBar";

type SidebarComponentType = React.ComponentType<any>;

type SidebarConfigType = {
  [key: string]: SidebarComponentType;
};

export const sidebarConfig: SidebarConfigType = {
  // '/channel-list': <ChannelSidebar />,
  // '/game-list': <GameSidebar />,
  // '/ranking': <RankingSidebar />,
  // ...
  "/": DefaultSideBar,
};
