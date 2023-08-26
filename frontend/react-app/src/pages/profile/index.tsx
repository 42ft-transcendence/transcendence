import NavBar from "@src/components/common/navBar";
import { sidebarConfig } from "@src/components/common/sideBar";
import { SidebarComponentType } from "@src/types";

const matchRoute = (currentRoute: string): SidebarComponentType | null => {
  for (const key in sidebarConfig) {
    const config = sidebarConfig[key];
    if (config.matcher) {
      if (config.matcher.test(currentRoute)) {
        return config.component;
      }
    } else if (key === currentRoute) {
      return config.component;
    }
  }
  return null;
};

const Profile = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const SidebarComponent = matchRoute(currentRoute);

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
    </>
  );
};

export default Profile;
