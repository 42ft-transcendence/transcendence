import { Navigate, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthPage from "@pages/auth";
import Login from "@pages/login";
import SignUp from "@src/pages/signUp";
import ChannelListPage from "@src/pages/channelList";
import Profile from "@src/pages/profile";
import UserList from "@src/pages/userList";
import GameList from "@src/pages/gameList";
import Ranking from "@src/pages/ranking";
import Socket from "./socket";
import Game from "@src/pages/game";
import ChannelPage from "@src/pages/channel";
import DirectMessagePage from "@src/pages/directMessage";
import authorizationLoader from "./loaders/authorization.loader";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Socket>
        <PrivateRoute>
          <ChannelListPage />
        </PrivateRoute>
      </Socket>
    ),
    loader: authorizationLoader,
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
    loader: authorizationLoader,
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
    loader: authorizationLoader,
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
    loader: authorizationLoader,
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
    loader: authorizationLoader,
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
    loader: authorizationLoader,
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
    loader: authorizationLoader,
  },
  {
    path: "/game/:gameRoomId",
    element: (
      <Socket>
        <PrivateRoute>
          <Game />
        </PrivateRoute>
      </Socket>
    ),
    loader: authorizationLoader,
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
    loader: authorizationLoader,
  },
  {
    path: "/direct-message/:userId",
    element: (
      <Socket>
        <PrivateRoute>
          <DirectMessagePage />
        </PrivateRoute>
      </Socket>
    ),
    loader: authorizationLoader,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default Router;
