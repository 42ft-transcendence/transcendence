import { useEffect } from "react";
import DirectMessagePageView from "./view";
import { chatSocket } from "@src/utils/sockets/chatSocket";
import { EnterDmReturnType } from "@src/types";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";

const DirectMessagePageContainer = () => {
  const setDmOther = useSetRecoilState(dmOtherState);
  const setDmList = useSetRecoilState(dmListState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const params = useParams();

  // Get channel info at enter
  useEffect(() => {
    const userId = params.userId as string;

    chatSocket.emit(
      "enter_dm",
      { userId },
      ({ toUser, dm }: EnterDmReturnType) => {
        setDmOther(toUser);
        setDmList(dm);
        setJoinedDmOtherList((prev) => {
          console.error("prev", prev);
          const filtered = prev.filter((other) => other.id !== userId);
          return [{ ...toUser, hasNewMessages: false }, ...filtered];
        });
      },
    );

    return () => {
      setDmOther(null);
      setDmList([]);
    };
  }, [params, setDmOther, setDmList, setJoinedDmOtherList]);

  return <DirectMessagePageView />;
};

export default DirectMessagePageContainer;
