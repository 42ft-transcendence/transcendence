import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";

// generate function is in user.ts

/**
 * 2FA 인증 요청
 * @method POST
 * @url /auth/two
 * @param code verify code
 * @returns
 */
export const verify2Fa = async (code: string): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/auth/two`,
    {
      code,
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
 * @method GET
 * @url /auth/generate
 * @returns 2fa 인증 링크 반환
 */
export const generate2FaLink = async (): Promise<AxiosResponse<string>> => {
  const response = await axios.get(`${base_url}/auth/generate`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

/**
 * @method POST
 * @url /auth/turn-on
 * @param code 2FA verify code
 * @returns
 */
export const turnOn2Fa = async (code: string): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/auth/turn-on`,
    {
      code,
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
 * @method POST
 * @url /auth/turn-off
 * @returns
 */
export const turnOff2Fa = async (): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/auth/turn-off`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};
