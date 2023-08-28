// import axios from "axios";
// axios.defaults.withCredentials = true;
export const base_url = "/api";

export { uploadAvatar, deleteAvatar } from "./file";
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
  createDummy,
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
