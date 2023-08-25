// import axios from "axios";
// axios.defaults.withCredentials = true;
export const base_url = import.meta.env.VITE_API_URL as string;

export { uploadAvatar } from "./file";
export type { UploadAvatarResponse } from "./file";

export { getMessagesByRoomId } from "./chatting";

export {
  getUser,
  login,
  setNickname,
  resignUser,
  logout,
  setAvatarPath,
  getUserInfo,
  getAllUserList,
  checkNickname,
} from "./user";

export { verify2Fa, generate2FaLink, turnOn2Fa, turnOff2Fa } from "./auth";

export {
  addFriend,
  deleteFriend,
  getFriendList,
  addBlock,
  deleteBlock,
  getBlockList,
} from "./relationship";

export { offerBattle } from "./game";
