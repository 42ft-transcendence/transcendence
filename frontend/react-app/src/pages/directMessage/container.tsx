import { useEffect, useState } from "react";
import DirectMessagePageView from "./view";
import { chatSocket } from "@router/socket/chatSocket";
import { ChatType, DirectMessageType, MessageType } from "@src/types";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  dmListState,
  dmPartnerState,
  joinedDmPartnerListState,
} from "@src/recoil/atoms/directMessage";
import { userDataState } from "@src/recoil/atoms/common";
import { getDM } from "@src/api/dm";

const DirectMessagePageContainer = () => {
  const [dmPartner, setDmPartner] = useRecoilState(dmPartnerState);
  const [dmList, setDmList] = useRecoilState(dmListState);
  const joinedDmPartnerList = useRecoilValue(joinedDmPartnerListState);
  const userData = useRecoilValue(userDataState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();

  const handleSendMessage = (content: string) => {
    chatSocket.emit(
      "send_dm",
      { message: content, userId: params.userId },
      (dm: DirectMessageType) => {
        setDmList((prev) => [...prev, dm]);
      },
    );
  };

  const handleInvite = () => {
    // TODO: invite
  };

  // Assemble chat list
  useEffect(() => {
    setChatList(() => {
      const rawChatList = dmList.map((dm) => {
        const message: MessageType = {
          id: dm.id.toString(),
          content: dm.message,
          userId: dm.from.id,
          channelId: dm.to.id,
        };
        if (dm.from.id === dmPartner?.id)
          return { message, user: dmPartner, role: "attendee" };
        else if (dm.from.id === userData.id)
          return { message, user: userData, role: "attendee" };
        else return undefined;
      });
      return rawChatList.filter((chat) => chat !== undefined) as ChatType[];
    });
  }, [setChatList, dmList, dmPartner, userData]);

  // Get channel info at enter
  useEffect(() => {
    const userId = params.userId as string;

    const partner = joinedDmPartnerList.find(
      (partner) => partner.id === userId,
    );
    setDmPartner(partner ? partner : null);
    getDM(userId)
      .then((response) => {
        setDmList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      setDmPartner(null);
      setDmList([]);
    };
  }, [params, joinedDmPartnerList, setDmPartner, setDmList]);

  return (
    <DirectMessagePageView
      onSendMessage={handleSendMessage}
      onInvite={handleInvite}
      chatList={chatList}
    />
  );
};

export default DirectMessagePageContainer;
