import { getUser } from "@src/api";
import { allUserListState, userDataState } from "@src/recoil/atoms/common";
import {
  gameModalState,
  gameRoomChatListState,
  gameRoomInfoInitState,
  gameRoomInfoState,
  gameRoomListState,
  matchHistoryListState,
} from "@src/recoil/atoms/game";
import { battleActionModalState } from "@src/recoil/atoms/modal";
import { UserType } from "@src/types";
import { useSetRecoilState } from "recoil";

const useInitializeState = () => {
  const setUserData = useSetRecoilState(userDataState);
  const setAllUserList = useSetRecoilState(allUserListState);
  const setBattleActionModal = useSetRecoilState(battleActionModalState);
  const setGameModal = useSetRecoilState(gameModalState);
  const setGameRoomList = useSetRecoilState(gameRoomListState);
  const setGameRoomInfo = useSetRecoilState(gameRoomInfoState);
  const setMatchHistoryList = useSetRecoilState(matchHistoryListState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);

  // 초기화 기능을 담당하는 함수
  const initializeStates = async () => {
    await getUser()
      .then((res) => {
        console.log(res);
        setUserData(res.data);
      })
      .catch((err) => void err);
    setAllUserList([]);
    setBattleActionModal({
      awayUser: {} as UserType,
      battleActionModal: false,
      gameRoomURL: "",
    });
    setGameModal({ gameMap: null });
    setGameRoomList([]);
    setGameRoomInfo(gameRoomInfoInitState);
    setMatchHistoryList([]);
    setGameRoomChatList([]);
  };

  return initializeStates; // 초기화 기능을 반환
};

export default useInitializeState;
