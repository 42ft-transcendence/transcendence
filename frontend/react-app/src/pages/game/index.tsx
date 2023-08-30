import NavBar from "@src/components/common/navBar";
import { routeMatch, sidebarConfig } from "@src/components/common/sideBar";

const Game = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const SideBarComponent = routeMatch(currentRoute, "/game/");

  return (
    <>
      <NavBar />
      {SideBarComponent && <SideBarComponent />}
    </>
  );
};

export default Game;
