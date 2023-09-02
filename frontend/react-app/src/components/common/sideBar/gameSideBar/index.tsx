import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { UserType } from "@src/types";
import { exitGameRoom, readyCancleSignal, readySignal } from "@src/api";

const GameSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );
  const [, setLeaveGameRoom] = useState(false);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
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
      onClick: async () => {
        await readySignal(gameRoomInfo.roomURL, userData);
        setGameRoomInfo({
          ...gameRoomInfo,
          homeReady: true,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "준비 취소",
      iconSrc: "",
      onClick: async () => {
        await readyCancleSignal(gameRoomInfo.roomURL, userData);
        setGameRoomInfo({
          ...gameRoomInfo,
          homeReady: false,
        });
      },
      theme: "LIGHT",
    },
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: async () => {
        setGameRoomInfo({
          roomURL: "",
          roomName: "",
          roomType: "",
          homeUser: {} as UserType,
          awayUser: {} as UserType,
          homeReady: false,
          awayReady: false,
        });
        await exitGameRoom(gameRoomInfo.roomURL, userData);
        navigate("/game-list");
        setLeaveGameRoom(true);
      },
      theme: "LIGHT",
    },
  ];
  const [filteredIconButtons, setfilteredIconButtons] =
    useState<IconButtonProps[]>(iconButtons);

  useEffect(() => {
    const newButtons = gameRoomInfo.homeReady
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
        <DS.TitleBox>내 전적</DS.TitleBox>
        <RateDoughnutChart userData={gameRoomInfo.homeUser} />
        <br />
        {gameRoomInfo.awayUser.id && (
          <>
            <DS.TitleBox>상대 전적</DS.TitleBox>
            <RateDoughnutChart userData={gameRoomInfo.awayUser} />
          </>
        )}
        <br />
      </DS.Container>
    </>
  );
};

export default GameSideBar;
