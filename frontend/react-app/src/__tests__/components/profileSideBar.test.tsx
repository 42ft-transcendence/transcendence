// import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import { SidebarComponentType } from "@src/types";
import { routeMatch, sidebarConfig } from "@src/components/common/sideBar";

// matchRoute 함수를 테스트하는 테스트 케이스
describe("matchRoute", () => {
  it("currentRoute가 /profile/:userId 일 때, ProfileSideBar 컴포넌트를 반환해야 함", () => {
    const currentRoute = "/profile/42-123";
    const SidebarComponent = routeMatch(
      currentRoute,
      "/profile/",
    ) as SidebarComponentType;
    expect(SidebarComponent).toBe(sidebarConfig["/profile/"].component);
  });

  it("currentRoute가 /profile/ 문자열만 있을 때, null을 반환해야 함", () => {
    const currentRoute = "/profile/";
    const SidebarComponent = routeMatch(currentRoute, "/profile/");
    console.log("SidebarComponent", SidebarComponent);
    expect(SidebarComponent).toBeNull();
  });

  it("currentRoute가 /profile 문자열만 있을 때, null을 반환해야 함", () => {
    const currentRoute = "/profile";
    const SidebarComponent = routeMatch(currentRoute, "/profile/");
    expect(SidebarComponent).toBeNull();
  });

  it("currentRoute가 /profile/ 뒤에 양식에 맞지 않은 id가 있을 때, null을 반환해야 함", () => {
    const currentRoute = "/profile/41-123456";
    const SidebarComponent = routeMatch(currentRoute, "/profile/");
    expect(SidebarComponent).toBeNull();
  });

  it("currentRoute가 일치하는 라우트가 없을 때, null을 반환해야 함", () => {
    const currentRoute = "/nonexistentroute";
    const SidebarComponent = routeMatch(currentRoute, "/profile/");
    expect(SidebarComponent).toBeNull();
  });
});
