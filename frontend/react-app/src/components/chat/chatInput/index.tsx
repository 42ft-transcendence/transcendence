import { useRecoilValue, useSetRecoilState } from "recoil";
import * as S from "./index.styled";
import { useEffect, useState } from "react";
import {
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import { userDataState } from "@src/recoil/atoms/common";
import { useMatch } from "react-router-dom";
import { chatSocket } from "@src/router/socket/chatSocket";
import { DirectMessageType, MessageType } from "@src/types";
import { dmListState, dmOtherState } from "@src/recoil/atoms/directMessage";
import sha256 from "crypto-js/sha256";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";
import { channelInviteModalState } from "@src/recoil/atoms/modal";

const ChatInput = () => {
  const [value, setValue] = useState<string>("");
  const [muted, setMuted] = useState<boolean>(false);
  const userData = useRecoilValue(userDataState);
  const participantList = useRecoilValue(participantListState);
  const isChannel = useMatch("/channel/:channelId");
  const isDM = useMatch("/direct-message/:dmId");
  const setMessageList = useSetRecoilState(messageListState);
  const setDmList = useSetRecoilState(dmListState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const setChannelInviteModalOpened = useSetRecoilState(
    channelInviteModalState,
  );
  const dmOther = useRecoilValue(dmOtherState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const hashTitle = (title: string): string => {
    const hash = sha256(title);
    return hash.toString(); // 해시 값을 문자열로 반환
  };

  const handleBattleOffer = (): void => {
    if (userData.id === dmOther?.id) {
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

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim().length === 0) return;
    if (isChannel) {
      chatSocket.emit(
        "send_message",
        { channelId: isChannel.params.channelId, message: value },
        ({ message }: { message: MessageType }) => {
          if (!message) {
            alert("채팅이 금지되었습니다.");
          } else {
            setMessageList((prev) => [...prev, message]);
          }
        },
      );
    } else if (isDM) {
      chatSocket.emit(
        "send_dm",
        { userId: isDM.params.dmId, message: value },
        ({ message }: { message: DirectMessageType }) => {
          if (!message) {
            alert("채팅이 차단되었습니다.");
          } else {
            setDmList((prev) => [...prev, message]);
          }
        },
      );
    }
    setValue("");
  };

  const handleInviteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isChannel) {
      setChannelInviteModalOpened(true);
    } else if (isDM && userData && dmOther) {
      handleBattleOffer();
    }
  };

  useEffect(() => {
    const myInfo = participantList.find(
      (participant) => participant.user?.id === userData.id,
    );
    if (myInfo?.muted) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  }, [participantList, userData]);

  return (
    <S.Container>
      <S.InviteButton
        onClick={handleInviteClick}
        $isChannel={isChannel == null}
      />
      <S.Form onSubmit={sendMessage}>
        <S.Input
          value={muted ? "관리자에 의해 채팅이 금지되었습니다." : value}
          onChange={handleInputChange}
          disabled={muted}
        />
        <S.SendButton type="submit" disabled={muted} />
      </S.Form>
    </S.Container>
  );
};

export default ChatInput;
