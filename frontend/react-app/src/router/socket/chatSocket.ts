import * as ioClient from "socket.io-client";

export const chatSocket = ioClient.io("http://localhost/ChatPage", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const chatSocketConnect = (jwt: string) => {
  if (chatSocket.disconnected) {
    chatSocket.io.opts.extraHeaders = {
      Authorization: `Bearer ${jwt}`,
    };
    chatSocket.connect();
  }
};
