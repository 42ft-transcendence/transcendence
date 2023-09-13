import { allUserListState } from "@recoil/atoms/common";
import {
  dmOtherState,
  joinedDmOtherListState,
} from "@recoil/atoms/directMessage";
import { selector } from "recoil";
import { JoinedDmOtherType, UserType } from "@src/types";

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
