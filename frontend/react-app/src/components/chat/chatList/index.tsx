import { useEffect, useRef } from "react";
import ChatInput from "@components/chat/chatInput";
import * as S from "./index.styled";

export interface ChatListProps {
  children?: React.ReactNode;
  onInvite: () => void;
}

const ChatList = ({ children, onInvite }: ChatListProps) => {
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
      <ChatInput onInvite={onInvite} />
    </S.Container>
  );
};

export default ChatList;
