import { useEffect, useState } from "react";
import DirectMessagePageView from "./view";
import { chatSocket } from "@router/socket/chatSocket";
import {
  ChatType,
  DirectMessageType,
  EnterDmReturnType,
  MessageType,
} from "@src/types";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { userDataState } from "@src/recoil/atoms/common";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";
import sha256 from "crypto-js/sha256";

const DirectMessagePageContainer = () => {
  const [dmOther, setDmOther] = useRecoilState(dmOtherState);
  const [dmList, setDmList] = useRecoilState(dmListState);
  const [, setJoinedDmOtherList] = useRecoilState(joinedDmOtherListState);
  const userData = useRecoilValue(userDataState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);

  const handleSendMessage = (content: string) => {
    const userId = params.userId as string;
    chatSocket.emit(
      "send_dm",
      { message: content, userId },
      (dm: DirectMessageType) => {
        console.log("send dm", dm);
        setDmList((prev) => [...prev, dm]);
      },
    );
  };

  const hashTitle = (title: string): string => {
    const hash = sha256(title);
    return hash.toString(); // 해시 값을 문자열로 반환
  };

  const handleInvite = () => {
    if (userData === null || dmOther === null) return;
    else if (userData.id === dmOther.id) {
      alert("자기 자신과 게임을 할 수 없습니다.");
      return;
    }
    try {
      const currentTime: Date = new Date();
      const roomURL = currentTime + userData.id;
      const hashedTitle = hashTitle(roomURL);
      console.log("hashedTitle", hashedTitle);
      setGameRoomURL(hashedTitle);
      gameSocket.emit("offerBattle", {
        awayUser: dmOther,
        myData: userData,
        gameRoomURL: hashedTitle,
        roomType: "PRIVATE",
      });
    } catch (error) {
      console.log(error);
    }
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

  return (
    <DirectMessagePageView
      onSendMessage={handleSendMessage}
      onInvite={handleInvite}
      chatList={chatList}
    />
  );
};

export default DirectMessagePageContainer;
