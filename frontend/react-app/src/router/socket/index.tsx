import * as cookies from "react-cookies";
import { gameSocket } from "./gameSocket";
import { useEffect } from "react";
import useGameSocket from "@src/hooks/useGameSocket";
import useChatSocket from "@src/hooks/useChatSocket";

const Socket = ({ children }: { children: React.ReactNode }) => {
  /**
   * Init socket connection
   */
  useEffect(() => {
    const jwt = cookies.load("jwt");
    if (jwt) {
      gameSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${jwt}`,
      };
      gameSocket.connect();
    }

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  useGameSocket();
  useChatSocket();

  return children;
};

export default Socket;
