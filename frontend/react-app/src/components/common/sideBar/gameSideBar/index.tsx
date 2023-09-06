import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState, gameRoomURLState } from "@src/recoil/atoms/game";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { gameSocket } from "@src/router/socket/gameSocket";

interface GameSideBarProps {
  isReady: boolean;
}

const GameSideBar = ({ isReady }: GameSideBarProps) => {
  const [userData] = useRecoilState(userDataState);
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );
  const [, setLeaveGameRoom] = useState(false);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const navigate = useNavigate();

  const iconButtons: IconButtonProps[] = [
    {
      title: "방 설정하기",
      iconSrc: "",
      onClick: () => {
        setCreateGameRoom(true);
        console.log("방 설정하기 :", createGameRoom);
      },
      theme: "LIGHT",
    },
    {
      title: "준비 하기",
      iconSrc: "",
      onClick: () => {
        gameSocket.emit("readyGameRoom", {
          gameRoomURL: gameRoomURL,
          userId: userData.id,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "준비 취소",
      iconSrc: "",
      onClick: () => {
        gameSocket.emit("readyCancleGameRoom", {
          gameRoomURL: gameRoomURL,
          userId: userData.id,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: async () => {
        gameSocket.emit("exitGameRoom", {
          gameRoomURL: gameRoomURL,
          user: userData,
        });
        navigate("/game-list");
        setGameRoomURL("");
        setLeaveGameRoom(true);
        // gameSocket.emit()
      },
      theme: "LIGHT",
    },
  ];
  const [filteredIconButtons, setfilteredIconButtons] =
    useState<IconButtonProps[]>(iconButtons);

  useEffect(() => {
    const newButtons = isReady
      ? iconButtons.filter((button) => button.title !== "준비 하기")
      : iconButtons.filter((button) => button.title !== "준비 취소");

    setfilteredIconButtons(newButtons);
  }, [gameRoomInfo]);

  return (
    <>
      <DS.Container>
        <DS.roomNameBox>
          {gameRoomInfo.roomName === "" ? "빠른 대전" : gameRoomInfo.roomName}
        </DS.roomNameBox>
        <br />
        <ButtonList buttons={filteredIconButtons} />
        <br />
        {/* <DS.TitleBox>내 전적</DS.TitleBox>
        <RateDoughnutChart userData={gameRoomInfo.homeUser} />
        <br />
        {gameRoomInfo.awayUser.id && (
          <>
            <DS.TitleBox>상대 전적</DS.TitleBox>
            <RateDoughnutChart userData={gameRoomInfo.awayUser} />
          </>
        )}
        <br /> */}
      </DS.Container>
    </>
  );
};

export default GameSideBar;
