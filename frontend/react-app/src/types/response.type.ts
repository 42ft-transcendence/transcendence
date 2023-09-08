// sing up page

import { AxiosResponse } from "axios";
import { NavigateFunction } from "react-router-dom";

export interface CheckNicknameType {
  message: string;
  status: number;
}

export interface ButtonHandlerProps {
  todo: () => Promise<AxiosResponse<void>>;
  navigate: NavigateFunction;
  setIsFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
