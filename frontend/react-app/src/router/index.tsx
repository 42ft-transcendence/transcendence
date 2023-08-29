import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthPage from "@pages/auth";
import Login from "@pages/login";
import SignUp from "@src/pages/signUp";
import TempHome from "@src/pages/tempHome";
import ChannelListPage from "@src/pages/channelList";
import Profile from "@src/pages/profile";
import UserList from "@src/pages/userList";
import GameList from "@src/pages/gameList";
import Ranking from "@src/pages/ranking";
import Socket from "./socket";
import ChannelPage from "@src/pages/channel";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Socket>
        <PrivateRoute>
          <TempHome />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/auth/:type",
    element: <AuthPage />,
  },
  {
    path: "/game-list",
    element: (
      <Socket>
        <PrivateRoute>
          <GameList />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/signup",
    element: (
      <Socket>
        <PrivateRoute>
          <SignUp />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/channel-list",
    element: (
      <Socket>
        <PrivateRoute>
          <ChannelListPage />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <Socket>
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/user-list",
    element: (
      <Socket>
        <PrivateRoute>
          <UserList />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/ranking",
    element: (
      <Socket>
        <PrivateRoute>
          <Ranking />
        </PrivateRoute>
      </Socket>
    ),
  },
  {
    path: "/channel/:channelId",
    element: (
      <Socket>
        <PrivateRoute>
          <ChannelPage />
        </PrivateRoute>
      </Socket>
    ),
  },
]);

export default Router;
