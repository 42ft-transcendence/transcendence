import { ChatType } from "@src/types";
import ChatBubble from "@components/chat/chatBubble";
import * as S from "./index.styled";

export interface ChatListItemPropsType {
  isMine: boolean;
  chat: ChatType;
}

const ChatListItem = ({ isMine, chat }: ChatListItemPropsType) => {
  if (isMine) {
    return (
      <S.Container $isMine={isMine}>
        <ChatBubble message={chat.message.content} isMine={isMine} />
      </S.Container>
    );
  } else {
    return (
      <S.Container $isMine={isMine}>
        <S.ProfileImage
          src={chat.user.avatarPath}
          $role={chat.role}
          alt={chat.user.nickname}
        />
        <S.ContentContainer>
          <S.Nickname>{chat.user.nickname}</S.Nickname>
          <ChatBubble message={chat.message.content} isMine={isMine} />
        </S.ContentContainer>
      </S.Container>
    );
  }
};

export default ChatListItem;
