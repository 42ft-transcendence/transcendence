import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";

const TempHome = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const CurrentSidebar = sidebarConfig[currentRoute];

  return (
    <>
      <NavBar />
      <CurrentSidebar />
    </>
  );
};

export default TempHome;
