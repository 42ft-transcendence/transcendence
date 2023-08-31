import { chatSocket } from "@src/router/socket/chatSocket";
import SetAdmin from "@assets/icons/setAdmin.svg";
import UnsetAdmin from "@assets/icons/unsetAdmin.svg";
import Mute from "@assets/icons/banChat.svg";
import Unmute from "@assets/icons/unbanChat.svg";
import Kick from "@assets/icons/kick.svg";

const setAdmin = (channelId: string, userId: string) => () => {
  chatSocket.emit("appoint_admin", { channelId, userId });
};

const unsetAdmin = (channelId: string, userId: string) => () => {
  chatSocket.emit("appoint_admin", { channelId, userId });
};

const muteUser = (channelId: string, userId: string) => () => {
  chatSocket.emit("mute_user", { channelId, userId });
};

const unmuteUser = (channelId: string, userId: string) => () => {
  chatSocket.emit("unmute_user", { channelId, userId });
};

const kickUser = (channelId: string, userId: string) => () => {
  chatSocket.emit("kick_user", { channelId, userId });
};

const channelButtons = (channelId: string, otherId: string) => ({
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
    action: kickUser(channelId, otherId),
    src: Kick,
  },
});

export type of = keyof typeof channelButtons;
export default channelButtons;
