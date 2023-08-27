import * as ioClient from "socket.io-client";
import * as cookies from "react-cookies";

export const chatSocket = ioClient.io("http://localhost/ChatPage", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const chatSocketConnect = () => {
  const jwt = cookies.load("jwt");
  if (jwt) {
    chatSocket.io.opts.extraHeaders = {
      Authorization: `Bearer ${jwt}`,
    };
    chatSocket.connect();
  }
};
