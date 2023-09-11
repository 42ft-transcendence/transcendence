import { useEffect, useState } from "react";
import DirectMessagePageView from "./view";
import { chatSocket } from "@src/utils/sockets/chatSocket";
import { ChatType, EnterDmReturnType, MessageType } from "@src/types";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { userDataState } from "@src/recoil/atoms/common";

const DirectMessagePageContainer = () => {
  const [dmOther, setDmOther] = useRecoilState(dmOtherState);
  const [dmList, setDmList] = useRecoilState(dmListState);
  const [, setJoinedDmOtherList] = useRecoilState(joinedDmOtherListState);
  const userData = useRecoilValue(userDataState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();

  useEffect(() => {
    console.log("dm list", dmList);
  }, [dmList]);

  useEffect(() => {
    console.log("other", dmOther);
  }, [dmOther]);

  // Assemble chat list
  useEffect(() => {
    console.log("assemble", dmList, dmOther, userData);
    setChatList(() => {
      const rawChatList = dmList.map((dm) => {
        const message: MessageType = {
          id: `${dm.id}`,
          content: dm.message,
          userId: dm.from.id,
          channelId: dm.to.id,
        };
        if (dm.from.id === dmOther?.id)
          return { message, user: dmOther, role: "attendee" };
        else if (dm.from.id === userData.id)
          return { message, user: userData, role: "attendee" };
        else return undefined;
      });
      return rawChatList.filter((chat) => chat !== undefined) as ChatType[];
    });
    // userData의 변화는 무시함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dmList, dmOther, setChatList]);

  // Get channel info at enter
  useEffect(() => {
    const userId = params.userId as string;

    chatSocket.emit(
      "enter_dm",
      { userId },
      ({ toUser, dm }: EnterDmReturnType) => {
        setDmOther(toUser);
        setDmList(dm);
        setJoinedDmOtherList((prev) => {
          console.error("prev", prev);
          const filtered = prev.filter((other) => other.id !== userId);
          return [{ ...toUser, hasNewMessages: false }, ...filtered];
        });
      },
    );

    return () => {
      setDmOther(null);
      setDmList([]);
    };
  }, [params, setDmOther, setDmList, setJoinedDmOtherList]);

  return <DirectMessagePageView chatList={chatList} />;
};

export default DirectMessagePageContainer;
