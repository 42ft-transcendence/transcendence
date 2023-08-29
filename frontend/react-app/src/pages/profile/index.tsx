import NavBar from "@src/components/common/navBar";
import { profileRouteMatch } from "@src/components/common/sideBar";
import { matchHistoryState } from "@src/recoil/atoms/game";
import { useRecoilState } from "recoil";

const Profile = () => {
  const currentRoute = window.location.pathname;
  const [matchHistory, setMatchHistory] = useRecoilState(matchHistoryState);

  console.log("currentRoute", currentRoute);
  const SidebarComponent = profileRouteMatch(currentRoute);

  console.log("matchHistory", matchHistory);

  return (
    <>
      <NavBar />
      {SidebarComponent && <SidebarComponent />}
    </>
  );
};

export default Profile;
