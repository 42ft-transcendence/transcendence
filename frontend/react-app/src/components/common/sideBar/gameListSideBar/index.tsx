import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import {
  createGameRoomModalState,
  isOpenRankGameWatingModalState,
} from "@src/recoil/atoms/modal";
import sha256 from "crypto-js/sha256";
import { gameSocket } from "@src/router/socket/gameSocket";
import {
  gameModalState,
  gameRoomChatListState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import { RankGameWaitingModal } from "@src/components/modal/game/rankGameWatingModal";
import { useEffect } from "react";

const GameListSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const setCreateGameRoom = useSetRecoilState(createGameRoomModalState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const [isOpenRankGameWatingModal, setIsOpenRankGameWatingModal] =
    useRecoilState(isOpenRankGameWatingModalState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);
  const setGameModal = useSetRecoilState(gameModalState);

  useEffect(() => {
    setGameRoomChatList([]);
    setGameModal({ gameMap: null });
  });

  const iconButtons: IconButtonProps[] = [
    {
      title: "방 만들기",
      iconSrc: "",
      onClick: () => {
        setCreateGameRoom(true);
        const gameRoomURL = sha256(new Date() + userData.id).toString();
        gameSocket.emit("createGameRoom", {
          user: userData,
          gameRoomURL: gameRoomURL,
        });
        gameSocket.emit("editGameRoomInfo", {
          gameRoomURL: gameRoomURL,
          infoType: "roomType",
          info: "CREATING",
        });
        setGameRoomURL(gameRoomURL);
      },
      theme: "LIGHT",
    },
    {
      title: "랭킹전 참가",
      iconSrc: "",
      onClick: () => {
        setIsOpenRankGameWatingModal(true);
        setTimeout(() => {
          gameSocket.emit("joinRankGame", {
            user: userData,
          });
        }, 3000); // 바로 소켓 통신을 하면, 두번째 사람은 누르자마자 매칭이 잡히기 때문에, 3초 뒤에 소켓 통신을 하도록 함.
      },
      theme: "LIGHT",
    },
  ];

  return (
    <DS.Container>
      <ButtonList buttons={iconButtons} />
      <br />
      <DS.TitleBox>내 전적</DS.TitleBox>
      <RateDoughnutChart userData={userData} />
      {/* 모달 영역 */}
      <RankGameWaitingModal
        isOpen={isOpenRankGameWatingModal}
        setIsOpen={setIsOpenRankGameWatingModal}
      />
    </DS.Container>
  );
};

export default GameListSideBar;
