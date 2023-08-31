import { chatSocket } from "@src/router/socket/chatSocket";
import SetAdmin from "@assets/icons/setAdmin.svg";
import UnsetAdmin from "@assets/icons/unsetAdmin.svg";
import Mute from "@assets/icons/banChat.svg";
import Unmute from "@assets/icons/unbanChat.svg";
import Kick from "@assets/icons/kick.svg";
import { ProfileModalOnClickHandler, ShowProfilePayload } from "@src/utils";
import { SetterOrUpdater } from "recoil";
import { UserType } from "@src/types";

const setAdmin = (channelId: string, userId: string) => () => {
  chatSocket.emit("appoint_admin", { channelId, userId, to: true });
};

const unsetAdmin = (channelId: string, userId: string) => () => {
  chatSocket.emit("appoint_admin", { channelId, userId, to: false });
};

const muteUser = (channelId: string, userId: string) => () => {
  chatSocket.emit("mute_user", { channelId, userId });
};

const unmuteUser = (channelId: string, userId: string) => () => {
  chatSocket.emit("unmute_user", { channelId, userId });
};

const kickUser =
  (
    channelId: string,
    userId: string,
    setShowProfile: SetterOrUpdater<ShowProfilePayload>,
  ) =>
  () => {
    chatSocket.emit("kick_user", { channelId, userId });
    ProfileModalOnClickHandler(setShowProfile, false, {} as UserType);
  };

const channelButtons = (
  channelId: string,
  otherId: string,
  setShowProfile: SetterOrUpdater<ShowProfilePayload>,
) => ({
  SetAdmin: {
    label: "관리자 설정",
    action: setAdmin(channelId, otherId),
    src: SetAdmin,
  },
  UnsetAdmin: {
    label: "관리자 해제",
    action: unsetAdmin(channelId, otherId),
    src: UnsetAdmin,
  },
  MuteUser: {
    label: "채팅 금지",
    action: muteUser(channelId, otherId),
    src: Mute,
  },
  UnmuteUser: {
    label: "채팅 허용",
    action: unmuteUser(channelId, otherId),
    src: Unmute,
  },
  KickUser: {
    label: "강제 퇴장",
    action: kickUser(channelId, otherId, setShowProfile),
    src: Kick,
  },
});

export type of = keyof typeof channelButtons;
export default channelButtons;
