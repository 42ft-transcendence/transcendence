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
import { dmListState } from "@src/recoil/atoms/directMessage";

export interface ChatInputPropsType {
  onInvite: () => void;
}

const ChatInput = ({ onInvite }: ChatInputPropsType) => {
  const [value, setValue] = useState<string>("");
  const [muted, setMuted] = useState<boolean>(false);
  const userData = useRecoilValue(userDataState);
  const participantList = useRecoilValue(participantListState);
  const isChannel = useMatch("/channel/:channelId");
  const isDM = useMatch("/dm/:dmId");
  const setMessageList = useSetRecoilState(messageListState);
  const setDmList = useSetRecoilState(dmListState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
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
        ({ dm }: { dm: DirectMessageType }) => {
          if (!dm) {
            alert("채팅이 차단되었습니다.");
          } else {
            setDmList((prev) => [...prev, dm]);
          }
        },
      );
    }
    setValue("");
  };

  const handleGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO: send game message
    onInvite();
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
        onClick={handleGameClick}
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
