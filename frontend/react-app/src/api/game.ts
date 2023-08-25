import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "@api";

// generate function is in user.ts

/**
 * 대전 신청
 * @method POST
 * @url /game/battle/offer
 * @param userID 대전 신청 상대 아이디
 * @returns
 */

export const offerBattle = async (
  userID: string,
  nickname: string,
): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/game/battle/offer`,
    {
      id: userID,
      nickname: nickname,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};
