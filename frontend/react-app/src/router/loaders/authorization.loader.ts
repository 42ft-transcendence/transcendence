import { getUser } from "@src/api";
import axios from "axios";

const authorizationLoader = async (): Promise<boolean> => {
  try {
    await getUser();
    return true;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized token");
    }
    return false;
  }
};

export default authorizationLoader;
