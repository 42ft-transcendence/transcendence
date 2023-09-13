import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import ChatList from "@components/chat/chatList";
import ChatListItem from "@components/chat/chatListItem";
import { useRecoilValue } from "recoil";
import { dmChatListState } from "@src/recoil/selectors/directMessage";

const DirectMessagePageView = () => {
  const chatList = useRecoilValue(dmChatListState);

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

export default DirectMessagePageView;
