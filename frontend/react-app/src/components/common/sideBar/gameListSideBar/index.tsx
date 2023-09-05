import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import sha256 from "crypto-js/sha256";
import { gameSocket } from "@src/router/socket/gameSocket";

const GameListSideBar = () => {
  const [userData, setUserData] = useRecoilState(userDataState);
  const setCreateGameRoom = useSetRecoilState(createGameRoomModalState);

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
          info: "PRIVATE",
        });
        setUserData({
          ...userData,
          gameRoomURL: gameRoomURL,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "랭킹전 참가",
      iconSrc: "",
      onClick: () => {
        console.log("랭킹전 참가");
      },
      theme: "LIGHT",
    },
    {
      title: "둘러보기",
      iconSrc: "",
      onClick: () => {
        console.log("둘러보기");
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
    </DS.Container>
  );
};

export default GameListSideBar;
