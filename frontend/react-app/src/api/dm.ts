import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { DirectMessageType } from "@type";

/**
 * 상대방과의 모든 DM 요청
 * @url /dm/dm?id=userId
 * @method GET
 * @param userId 상대방 아이디
 * @returns 상대방과의 모든 DM 요청
 */
export const getDM = async (
  userId: string,
): Promise<AxiosResponse<DirectMessageType[]>> => {
  const response = await axios.get(`${base_url}/dm/dm?id=${userId}`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};
