import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import ChatList from "@components/chat/chatList";
import ChatListItem from "@components/chat/chatListItem";
import { ChatType } from "@type";
import { userDataState } from "@src/recoil/atoms/common";
import { useRecoilValue } from "recoil";

export interface DirectMessagePageViewPropsType {
  onInvite: () => void;
  chatList: ChatType[];
}

const DirectMessagePageView = ({
  onInvite,
  chatList,
}: DirectMessagePageViewPropsType) => {
  const userData = useRecoilValue(userDataState);

  return (
    <>
      <NavBar />
      <ChattingSideBar />
      <ChatList onInvite={onInvite}>
        {chatList.map((chat) => (
          <ChatListItem
            key={chat.message.id}
            chat={chat}
            isMine={(chat.user.id as string) === (userData.id as string)}
          />
        ))}
      </ChatList>
    </>
  );
};

export default DirectMessagePageView;
