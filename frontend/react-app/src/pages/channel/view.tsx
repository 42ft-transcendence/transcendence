import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import ChatList from "@components/chat/chatList";
import ChatListItem from "@components/chat/chatListItem";
import { useRecoilValue } from "recoil";
import { channelChatListState } from "@recoil/selectors/channel";

const ChannelPageView = () => {
  const chatList = useRecoilValue(channelChatListState);

  return (
    <>
      <NavBar />
      <ChattingSideBar />
      <ChatList>
        {chatList.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </ChatList>
    </>
  );
};

export default ChannelPageView;
