import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthPage from "@pages/auth";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <div>Home</div>
      </PrivateRoute>
    ),
  },
  {
    path: "/Login",
    element: <div>Login</div>,
  },
  {
    path: "/auth/:type",
    element: <AuthPage />,
  },
  // {
  //   path: "/",
  //   element: <ChatPage />,
  // },
  // {
  //   path: "/auth/:type",
  //   element: <Auth />,
  // },
  // {
  //   path: "/SignUp",
  //   element: <SignUp />,
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
