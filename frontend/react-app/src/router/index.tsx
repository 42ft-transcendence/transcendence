import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthPage from "@pages/auth";
import Login from "@pages/login";
import SignUp from "@src/pages/signUp";
import TempHome from "@src/pages/tempHome";
import Profile from "@src/pages/profile";
import UserList from "@src/pages/userList";
import GameList from "@src/pages/gameList";
import Ranking from "@src/pages/ranking";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <TempHome />
      </PrivateRoute>
    ),
  },
  {
    path: "/channel-list",
    element: (
      <PrivateRoute>
        <TempHome />
      </PrivateRoute>
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
      <PrivateRoute>
        <GameList />
      </PrivateRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PrivateRoute>
        <SignUp />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/user-list",
    element: (
      <PrivateRoute>
        <UserList />
      </PrivateRoute>
    ),
  },
  {
    path: "/ranking",
    element: (
      <PrivateRoute>
        <Ranking />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "/auth/:type",
  //   element: <Auth />,
  // },
  // {
  //   path: "/channel-list",
  //   element: <ChannelListPage />,
  // },
  // {
  //   path: "/channel/:channelId",
  //   element: <ChannelPage />,
  // },
]);

export default Router;
