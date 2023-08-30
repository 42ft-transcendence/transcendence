import { SidebarComponentType, SidebarConfigType } from "@src/types";
import ChattingSideBar from "./chattingSideBar";
import ProfileSideBar from "./profileSideBar";
import UserListSideBar from "./userListSideBar";
import GameSideBar from "./gameSideBar";
import RankingSideBar from "./rankingSideBar";
import GameListSideBar from "./gameListSideBar";

export const sidebarConfig: SidebarConfigType = {
  // ...
  "/": { component: ChattingSideBar },
  "/channel-list": { component: ChattingSideBar },
  "/game-list": { component: GameListSideBar },
  "/ranking": { component: RankingSideBar },
  "/user-list": { component: UserListSideBar },
  "/profile/": {
    component: ProfileSideBar,
    matcher: /^\/profile\/(42-|G-)\d+$/, // '42-' 혹은 'G-'로 시작하고 그 뒤에 숫자로만 이루어진 문자열이 나오는 경우만 매치합니다.
  },
  "/game/": { component: GameSideBar, matcher: /^\/game\/[\w-]+$/ },
};

export const routeMatch = (
  currentRoute: string,
  keyProps: string,
): SidebarComponentType | null => {
  for (const key in sidebarConfig) {
    const config = sidebarConfig[key];

    // 만약 matcher가 있고 currentRoute와 일치한다면
    if (config.matcher?.test(currentRoute)) {
      return config.component;
    }

    // 만약 key와 currentRoute가 정확히 일치한다면
    if (key === currentRoute && key !== keyProps) {
      return config.component;
    }
  }

  return null; // 일치하는 라우트가 없을 때
};
