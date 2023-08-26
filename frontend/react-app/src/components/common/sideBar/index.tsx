import { SidebarConfigType } from "@src/types";
import chattingSideBar from "./chattingSideBar";
import ProfileSideBar from "./profileSideBar";

export const sidebarConfig: SidebarConfigType = {
  // '/channel-list': <ChannelSidebar />,
  // '/game-list': <GameSidebar />,
  // '/ranking': <RankingSidebar />,
  // ...
  "/": { component: chattingSideBar },
  "/profile/": {
    component: ProfileSideBar,
    matcher: /^\/profile\/.+$/, // 이 정규식은 /profile/ 다음에 어떤 문자열이든 매치합니다.
  },
};
