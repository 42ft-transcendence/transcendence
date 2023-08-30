import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { DirectMessageType } from "@type";

/**
 * 상대방과의 모든 DM 요청
 * @url /dm/dm
 * @method GET
 * @returns 상대방과의 모든 DM 요청
 */
export const getDM = async (): Promise<AxiosResponse<DirectMessageType[]>> => {
  const response = await axios.get(`${base_url}/dm/dm`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};
