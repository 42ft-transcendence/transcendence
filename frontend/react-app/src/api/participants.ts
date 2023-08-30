import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { ChannelType, ParticipantType } from "@type";

/**
 * 내가 참여한 채팅방 리스트 요청
 * @url /participants/channels
 * @method GET
 * @returns 내가 참여한 채팅방 리스트 반환
 */
export const getMyChannels = async (): Promise<
  AxiosResponse<ChannelType[]>
> => {
  const response = await axios.get(`${base_url}/participants/channels`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 채팅방 참가자 리스트 요청
 * @url /participants/participants?channelId=channelId
 * @method GET
 * @param channelId 채팅방 아이디
 * @returns 채팅방 참가자 리스트 반환
 */
export const getParticipantsByChannelId = async (
  channelId: string,
): Promise<AxiosResponse<ParticipantType[]>> => {
  const response = await axios.get(
    `${base_url}/participants/participants?channelId=${channelId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};
