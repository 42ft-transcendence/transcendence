import { useEffect, useRef } from "react";
import ChatInput from "@components/chat/chatInput";
import * as S from "./index.styled";

export interface ChatListProps {
  children?: React.ReactNode;
  onSendMessage: (message: string) => void;
  onInvite: () => void;
  isChannel: boolean;
}

const ChatList = ({
  children,
  onSendMessage,
  onInvite,
  isChannel,
}: ChatListProps) => {
  const messageEndRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <S.Container>
      <S.ChatList>
        {children}
        <li ref={messageEndRef} />
      </S.ChatList>
      <ChatInput
        onSendMessage={onSendMessage}
        onInvite={onInvite}
        isChannel={isChannel}
      />
    </S.Container>
  );
};

export default ChatList;
