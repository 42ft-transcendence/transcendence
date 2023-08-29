import { useEffect, useRef } from "react";
import ChatInput from "@components/chat/chatInput";
import * as S from "./index.styled";

export interface ContentChatListProps {
  children?: React.ReactNode;
  onSendMessage: (message: string) => void;
  isChannel: boolean;
}

const ContentChatList = ({
  children,
  onSendMessage,
  isChannel,
}: ContentChatListProps) => {
  const messageEndRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <>
      <S.ChatList>
        {children}
        <li ref={messageEndRef} />
      </S.ChatList>
      <ChatInput onSendMessage={onSendMessage} isChannel={isChannel} />
    </>
  );
};

export default ContentChatList;
