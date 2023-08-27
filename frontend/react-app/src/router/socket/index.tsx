import { ChatType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");

  if (!jwt) {
    chatSocket.disconnect();
  } else {
    // Init chat socket events
    chatSocket.off("refresh_list");
    chatSocket.on("refresh_list", (userList: UserType[]) => {
      console.log("refresh_list", userList);
    });

    chatSocket.off("get_message");
    chatSocket.on("get_message", (chat: ChatType) => {
      console.log("get_message", chat);
    });

    // chatSocket.off("get_dm");
    // chatSocket.on("get_dm", () => {});

    chatSocketConnect(jwt);
  }

  return children;
};

export default Socket;
