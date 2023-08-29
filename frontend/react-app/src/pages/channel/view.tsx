import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import ChatList from "@components/chat/chatList";
import ChatListItem from "@components/chat/chatListItem";
import { ChatType } from "@type";
import { userDataState } from "@src/recoil/atoms/common";
import { useRecoilValue } from "recoil";

export interface ChannelPageViewPropsType {
  onSendMessage: (keyword: string) => void;
  onInvite: () => void;
  chatList: ChatType[];
}

const ChannelPageView = ({
  onSendMessage,
  onInvite,
  chatList,
}: ChannelPageViewPropsType) => {
  const userData = useRecoilValue(userDataState);

  return (
    <>
      <NavBar />
      <ChattingSideBar />
      <ChatList
        onSendMessage={onSendMessage}
        onInvite={onInvite}
        isChannel={true}
      >
        {chatList.map((chat) => (
          <ChatListItem
            key={chat.message.id}
            chat={chat}
            isMine={chat.user.id === userData.id}
          />
        ))}
      </ChatList>
    </>
  );
};

export default ChannelPageView;
