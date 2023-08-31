import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { UserType } from "@type";

/**
 * 친구 추가 요청
 * @url /relationship/friend
 * @method POST
 * @param user_id 친구 추가할 유저의 id
 * @returns 성공했을 때 void response
 */
export const addFriend = async (
  user_id: string,
): Promise<AxiosResponse<void>> => {
  const response = await axios.post(
    `${base_url}/relationship/friends`,
    {
      id: user_id,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 친구 삭제 요청
 * @url /relationship/friend?id={user_id}
 * @method DELETE
 * @param user_id 친구 삭제할 유저의 id
 */
export const deleteFriend = async (
  user_id: string,
): Promise<AxiosResponse<void>> => {
  const response = await axios.delete(
    `${base_url}/relationship/friends?id=${user_id}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 친구 목록 조회 요친
 * @url /relationship/friend
 * @method GET
 * @returns 성공했을 때 자신의 친구 목록을 반환
 */
export const getFriendList = async (): Promise<
  AxiosResponse<UserType[], UserType[]>
> => {
  const response = await axios.get(`${base_url}/relationship/friends`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  console.log("getFriendList", response);
  return response;
};

/**
 * 차단 추가 요청
 * @url /relationship/friend
 * @method POST
 * @param user_id 차단할 유저의 id
 * @returns 성공했을 때 void response
 */
export const addBlock = async (
  user_id: string,
): Promise<AxiosResponse<void>> => {
  const response = await axios.post(
    `${base_url}/relationship/block`,
    {
      id: user_id,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 차단 삭제 요청
 * @url /relationship/block?id={user_id}
 * @method DELETE
 * @param user_id 차단 삭제할 유저의 id
 */
export const deleteBlock = async (
  user_id: string,
): Promise<AxiosResponse<void>> => {
  const response = await axios.delete(
    `${base_url}/relationship/block?id=${user_id}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 친구 목록 조회 요친
 * @url /relationship/block
 * @method GET
 * @returns 성공했을 때 자신의 차단 목록을 반환
 */
export const getBlockList = async (): Promise<AxiosResponse<UserType[]>> => {
  const response = await axios.get(`${base_url}/relationship/block`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};
