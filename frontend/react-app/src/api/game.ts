import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { MatchHistoryType } from "@src/types";

export const getHistoryById = async (
  id: string,
): Promise<AxiosResponse<MatchHistoryType[]>> => {
  const response = await axios.get(`${base_url}/MatchHistory/${id}`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};

export const createDummyHistory = () => {
  axios.post(`${base_url}/game/dummyHistory`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
};
