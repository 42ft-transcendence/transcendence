import chattingSideBar from "./chattingSideBar";

type SidebarComponentType = React.ComponentType<any>;

type SidebarConfigType = {
  [key: string]: SidebarComponentType;
};

export const sidebarConfig: SidebarConfigType = {
  // '/channel-list': <ChannelSidebar />,
  // '/game-list': <GameSidebar />,
  // '/ranking': <RankingSidebar />,
  // ...
  "/": chattingSideBar,
};
