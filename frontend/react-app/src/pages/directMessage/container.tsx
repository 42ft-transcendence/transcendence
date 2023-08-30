import { useEffect, useState } from "react";
import DirectMessagePageView from "./view";
import { chatSocket } from "@router/socket/chatSocket";
import { ChatType, DirectMessageType, MessageType } from "@src/types";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { allUserListState, userDataState } from "@src/recoil/atoms/common";
import { getDM } from "@src/api/dm";

const DirectMessagePageContainer = () => {
  const [dmOther, setDmOther] = useRecoilState(dmOtherState);
  const [dmList, setDmList] = useRecoilState(dmListState);
  const [joinedDmOtherList, setJoinedDmOtherList] = useRecoilState(
    joinedDmOtherListState,
  );
  const userData = useRecoilValue(userDataState);
  const allUserList = useRecoilValue(allUserListState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();

  const handleSendMessage = (content: string) => {
    const userId = params.userId as string;
    if (dmOther && !joinedDmOtherList.find((other) => other.id === userId)) {
      setJoinedDmOtherList((prev) => [
        ...prev,
        { ...dmOther, hasNewMessages: false },
      ]);
    }
    chatSocket.emit(
      "send_dm",
      { message: content, userId },
      (dm: DirectMessageType) => {
        console.log("send dm", dm);
        setDmList((prev) => [...prev, dm]);
      },
    );
  };

  const handleInvite = () => {
    // TODO: invite
  };

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
  }, [dmList, dmOther, setChatList]);

  // Get channel info at enter
  useEffect(() => {
    const userId = params.userId as string;

    const other = allUserList.find((user) => user.id === userId);

    setDmOther(other ? other : null);
    // getDM(userId)
    //   .then((response) => {
    //     setDmList(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // setJoinedDmOtherList((prev) =>
    //   prev.map((other) =>
    //     other.id === userId ? { ...other, hasNewMessages: false } : other,
    //   ),
    // );

    return () => {
      setDmOther(null);
      setDmList([]);
    };
  }, [params, setDmOther, setDmList, setJoinedDmOtherList]);

  return (
    <DirectMessagePageView
      onSendMessage={handleSendMessage}
      onInvite={handleInvite}
      chatList={chatList}
    />
  );
};

export default DirectMessagePageContainer;
