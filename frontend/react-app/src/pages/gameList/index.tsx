import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";

const GameList = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const CurrentSideBar = sidebarConfig[currentRoute];
  const CurrentSideBarComponent = CurrentSideBar.component;

  return (
    <>
      <NavBar />
      <CurrentSideBarComponent />
    </>
  );
};

export default GameList;
