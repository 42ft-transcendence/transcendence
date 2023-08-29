import { ChatType, OfferGameType, UserType } from "@type";
import { chatSocket, chatSocketConnect } from "./chatSocket";
import * as cookies from "react-cookies";
import { gameSocket, gameSocketConnect } from "./gameSocket";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { battleActionModalState } from "@src/recoil/atoms/modal";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");
  const [user] = useRecoilState(userDataState);
  const [, setBattleActionModal] = useRecoilState(battleActionModalState);

  if (!jwt) {
    chatSocket.disconnect();
    gameSocket.disconnect();
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

    gameSocket.off("offerGame");
    gameSocket.on("offerGame", (data: OfferGameType) => {
      // console.log("대전 신청 소켓 통신 확인: ", data, data.user_id);
      console.log("user.id", user.id);
      // setBattleActionModal({
      //   battleActionModal: user.id === data.user_id,
      //   nickname: data.nickname,
      // });
      // setBattleActionModal(user.id === data.user_id);
    });

    chatSocketConnect(jwt);
    gameSocketConnect(jwt);
  }

  return children;
};

export default Socket;
