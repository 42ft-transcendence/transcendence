import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { UserType, CheckNicknameType } from "@type";

/**
 *
 * @returns token과 일치하는 유저 정보 반환
 */
export const getUser = async (): Promise<AxiosResponse<UserType>> => {
  const response = await axios.get(`${base_url}/users/user`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 로그인 요청
 * @url /users/login
 * @method POST
 * @param type 로그인 도메인
 * @param code 42 OAuth에서 받은 인증 코드
 * @returns 성공했을 때 user object를 반환
 */
export const login = async (
  type: string,
  code: string,
): Promise<AxiosResponse<UserType>> => {
  const response = await axios.post(`${base_url}/users/login`, {
    type,
    code,
  });
  return response;
};

/**
 * 유저 정보 수정 요청
 * @url /users/nickname
 * @method POST
 * @param nickname 변경하고싶은 닉네임
 * @returns 성공했을 때 user object를 반환
 */
export const setNickname = async (
  nickname: string,
): Promise<AxiosResponse<UserType>> => {
  const response = await axios.post(
    `${base_url}/users/nickname`,
    {
      nickname,
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
 * 유저 계정 삭제 요청
 * @returns void response
 */
export const resignUser = async (): Promise<AxiosResponse<void>> => {
  const response = await axios.delete(`${base_url}/users`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 로그아웃 요청
 * @url /users/logout
 * @method POST
 * @returns void response
 */
export const logout = async (): Promise<AxiosResponse<void>> => {
  const response = await axios.post(
    `${base_url}/users/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

/**
 * 프로필 사진 설정
 * @url /users/avatarPathUpdate
 * @method POST
 * @param avatarPath 아바타로 사용할 파일 이름
 * @returns 성공했을 때 user object를 반환
 */
export const setAvatarPath = async (
  avatarPath: string,
): Promise<AxiosResponse<UserType>> => {
  const response = await axios.post(
    `${base_url}/users/avatarPathUpdate`,
    {
      avatarPath,
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
 * 프로필 사진 설정
 * @url /users/avatarPathUpdate
 * @method POST
 * @param userId // 상대방 아이디
 * @returns 성공했을 때 true, false 를 반환
 */

export const Battle = async (
  userId: string,
): Promise<AxiosResponse<boolean, boolean>> => {
  const response = await axios.post(
    `${base_url}game/battle/offer`,
    {
      userId,
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
 * 온라인 유저 정보 요정
 * @url /users/login/userlist
 * @method GET
 * @returns 온라인 유저 리스트 반환
 */
export const getUserInfo = async (): Promise<AxiosResponse<UserType[]>> => {
  const response = await axios.get(`${base_url}/users/login/userlist`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 서버에 등록된 모든 유저 정보 요청
 * @url /users/
 * @method GET
 * @returns 유저 정보 리스트 반환
 */
export const getAllUserList = async (): Promise<AxiosResponse<UserType[]>> => {
  const response = await axios.get(`${base_url}/users/`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * 닉네임 유효성 검사 요청
 * @url /users/checkNickname?nickname=nickname
 * @method GET
 * @param nickname 확인할 닉네임
 * @returns 오류 메세지, 상태코드 반환
 */
export const checkNickname = async (
  nickname: string,
): Promise<AxiosResponse<CheckNicknameType, CheckNicknameType>> => {
  const response = await axios.get(
    `${base_url}/users/checkNickname?nickname=${nickname}`,
  );
  return response;
};

/**
 * 더미 유저 생성 요청
 * @url /users/createDummy
 * @method POST
 * @param count 생성할 더미 유저 수
 * @returns 메세지 반환
 */
export const createDummy = async (
  count: number,
): Promise<AxiosResponse<string, string>> => {
  const response = await axios.post(`${base_url}/users/createDummy`, { count });
  return response;
};
