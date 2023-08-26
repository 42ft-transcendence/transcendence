import NavBar from "@src/components/common/navBar";
import { profileRouteMatch } from "@src/components/common/sideBar";

const Profile = () => {
  const currentRoute = window.location.pathname;

  console.log("currentRoute", currentRoute);
  const SidebarComponent = profileRouteMatch(currentRoute);

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
    </>
  );
};

export default Profile;
