import { allUserListState, userDataState } from "@recoil/atoms/common";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@recoil/atoms/directMessage";
import { selector } from "recoil";
import { ChatType, JoinedDmOtherType, UserType } from "@src/types";

export const dmUserState = selector<UserType | null>({
  key: "dmUserState",
  get: ({ get }) => {
    const allUserList = get(allUserListState);
    const dmOther = get(dmOtherState);

    const dmUser = allUserList.find((user) => user.id === dmOther?.id) ?? null;

    return dmUser;
  },
});

export const dmUserListState = selector<JoinedDmOtherType[]>({
  key: "dmUserListState",
  get: ({ get }) => {
    const allUserList = get(allUserListState);
    const joinedDmOtherList = get(joinedDmOtherListState);

    const dmUserList = joinedDmOtherList.map((item) => {
      const user = allUserList.find((user) => user.id === item.id) ?? item;
      return {
        ...user,
        hasNewMessages: item.hasNewMessages,
      };
    });

    return dmUserList;
  },
});

export const dmChatListState = selector<ChatType[]>({
  key: "dmChatListState",
  get: ({ get }) => {
    const dmUser = get(dmUserState);
    const selfUser = get(userDataState);
    const messageList = get(dmListState);

    const chatList = messageList
      .map((item) => {
        if (item.from.id === dmUser?.id) {
          return {
            message: item.message,
            user: dmUser,
            role: "attendee",
          };
        } else if (item.from.id === selfUser?.id) {
          return {
            message: item.message,
            user: selfUser,
            role: "attendee",
          };
        } else return null;
      })
      .filter((item) => item !== null) as ChatType[];

    return chatList;
  },
});
