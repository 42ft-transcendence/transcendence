import { ChatType } from "@src/types";
import ChatBubble from "@components/chat/chatBubble";
import * as S from "./index.styled";
import { useSetRecoilState } from "recoil";
import { showProfileState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";

export interface ChatListItemPropsType {
  chat: ChatType;
}

const ChatListItem = ({ chat }: ChatListItemPropsType) => {
  const setShowProfile = ProfileModalOnClickHandler(
    useSetRecoilState(showProfileState),
    true,
    chat.user,
  );

  const handleProfileClick = () => {
    setShowProfile();
  };

  return (
    <S.Container $isMine={chat.role === "self"}>
      {chat.role === "self" ? (
        <>
          <ChatBubble message={chat.message} isMine={true} />
        </>
      ) : (
        <>
          <S.ProfileImage
            src={chat.user.avatarPath}
            $role={chat.role}
            alt={chat.user.nickname}
            onClick={handleProfileClick}
          />
          <S.ContentContainer>
            <S.Nickname>{chat.user.nickname}</S.Nickname>
            <ChatBubble message={chat.message} isMine={false} />
          </S.ContentContainer>
        </>
      )}
    </S.Container>
  );
};

export default ChatListItem;
