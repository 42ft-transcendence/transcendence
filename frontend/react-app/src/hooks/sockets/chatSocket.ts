import * as ioClient from "socket.io-client";
import * as cookies from "react-cookies";

const socket = ioClient.io("http://localhost/ChatPage", {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 10,
});

const useChatSocket = (autoConnect = false) => {
  if (autoConnect && socket.disconnected) {
    const token = cookies.load("jwt") as string;
    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
    };
    socket.connect();
  }
  return socket;
};

const chatSocketConnect = () => {
  if (socket.disconnected) {
    const token = cookies.load("jwt") as string;
    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
    };
    socket.connect();
  }
};

const chatSocketDisconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

const chatSocketReconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
  const token = cookies.load("jwt") as string;
  socket.io.opts.extraHeaders = {
    Authorization: `Bearer ${token}`,
  };
  socket.connect();
};

export default useChatSocket;
export { chatSocketConnect, chatSocketDisconnect, chatSocketReconnect };
