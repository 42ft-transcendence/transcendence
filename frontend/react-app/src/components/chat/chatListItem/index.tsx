import { ChatType } from "@src/types";
import ChatBubble from "@components/chat/chatBubble";
import * as S from "./index.styled";
import { useSetRecoilState } from "recoil";
import { showProfileState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";

export interface ChatListItemPropsType {
  isMine: boolean;
  chat: ChatType;
}

const ChatListItem = ({ isMine, chat }: ChatListItemPropsType) => {
  const setShowProfile = ProfileModalOnClickHandler(
    useSetRecoilState(showProfileState),
    true,
    chat.user,
  );

  const handleProfileClick = () => {
    setShowProfile();
  };

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
          onClick={handleProfileClick}
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
