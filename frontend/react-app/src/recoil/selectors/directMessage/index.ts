import { allUserListState } from "@recoil/atoms/common";
import { dmOtherState } from "@recoil/atoms/directMessage";
import { selector } from "recoil";
import { UserType } from "@src/types";

export const dmUserState = selector<UserType | null>({
  key: "dmUserState",
  get: ({ get }) => {
    const allUserList = get(allUserListState);
    const dmOther = get(dmOtherState);

    const dmUser = allUserList.find((user) => user.id === dmOther?.id) ?? null;

    return dmUser;
  },
});
