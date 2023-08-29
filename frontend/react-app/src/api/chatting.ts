import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { MessageType, ChannelType } from "@type";
// import { MessageType, ChannelType } from "@src/types";

/**
 * 채팅방의 모든 메시지 요청
 * @url /chatting/messages?channelId=channelId
 * @method GET
 * @param channelId 채팅방 아이디
 * @returns 채팅방의 메세지 리스트 반환
 */
export const getMessagesByChannelId = async (
  channelId: string,
): Promise<AxiosResponse<MessageType[]>> => {
  const response = await axios.get(
    `${base_url}/chatting/messages?channelId=${channelId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 모든 채팅방 요청
 * @url /chatting/channels/all
 * @method GET
 * @returns 채팅방 리스트 반환
 */
export const getAllChannels = async (): Promise<
  AxiosResponse<ChannelType[]>
> => {
  const response = await axios.get(`${base_url}/chatting/channels/all`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 채팅방 검색 요청
 * @url /chatting/channels/search?keyword=keyword
 * @param keyword 검색 키워드
 * @returns 검색된 채팅방 리스트 반환
 */
export const getSearchedChannels = async (
  keyword: string,
): Promise<AxiosResponse<ChannelType[]>> => {
  const response = await axios.get(
    `${base_url}/chatting/channels/search?keyword=${keyword}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};
