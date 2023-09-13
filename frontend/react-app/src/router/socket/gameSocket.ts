import * as ioClient from "socket.io-client";

export const gameSocket = ioClient.io(`${process.env.VITE_BASE_URL}/game`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const gameSocketConnect = (jwt: string) => {
  if (gameSocket.disconnected) {
    gameSocket.io.opts.extraHeaders = {
      Authorization: `Bearer ${jwt}`,
    };
    gameSocket.connect();
  }
};
