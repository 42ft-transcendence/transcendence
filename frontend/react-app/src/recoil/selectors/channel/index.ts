import { allUserListState } from "@recoil/atoms/common";
import { messageListState, participantListState } from "@recoil/atoms/channel";
import { selector } from "recoil";
import { ChatType, ParticipantType } from "@src/types";

export const channelUserListState = selector<ParticipantType[]>({
  key: "channelUserListState",
  get: ({ get }) => {
    const allUserList = get(allUserListState);
    const participantList = get(participantListState);

    const channelUserList = participantList
      .map((item) => {
        const user = allUserList.find((user) => item.id === user.id);
        return {
          ...item,
          user,
        };
      })
      .filter((item) => item.user !== undefined);

    return channelUserList;
  },
});

export const channelChatListState = selector<ChatType[]>({
  key: "channelChatListState",
  get: ({ get }) => {
    const participantList = get(participantListState);
    const messageList = get(messageListState);

    const chatList = messageList
      .map((item) => {
        const from = participantList.find((user) => user.id === item.userId);
        if (!from) return null;
        return {
          message: item.content,
          user: from?.user ?? null,
          role: from?.owner
            ? "owner"
            : from?.admin
            ? "admin"
            : from?.id === item.userId
            ? "self"
            : "attendee",
        };
      })
      .filter((item) => item !== null) as ChatType[];

    return chatList;
  },
});
