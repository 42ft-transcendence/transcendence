// sing up page

import { AxiosResponse } from "axios";
import { NavigateFunction } from "react-router-dom";

export interface CheckNicknameType {
  message: string;
  status: number;
}

export interface buttonHandlerProps {
  todo: () => Promise<AxiosResponse<void>>;
  navigate: NavigateFunction;
}
