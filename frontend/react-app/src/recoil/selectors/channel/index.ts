import { allUserListState } from "@recoil/atoms/common";
import { participantListState } from "@recoil/atoms/channel";
import { selector } from "recoil";
import { ParticipantType } from "@src/types";

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
