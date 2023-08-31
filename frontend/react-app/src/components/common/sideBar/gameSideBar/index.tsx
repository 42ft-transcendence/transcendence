import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
// import { roomNameBox } from "./index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameRoomName } from "@src/recoil/atoms/game";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";

const GameSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const [roomTitle] = useRecoilState(gameRoomName);
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );
  const [, setLeaveGameRoom] = useState(false);
  const navigate = useNavigate();
  const roomSettingButtons: IconButtonProps[] = [
    {
      title: "방 설정하기",
      iconSrc: "",
      onClick: () => {
        setCreateGameRoom(true);
        console.log("방 설정하기 :", createGameRoom);
      },
      theme: "LIGHT",
    },
  ];
  const iconButtons: IconButtonProps[] = [
    {
      title: "준비 하기",
      iconSrc: "",
      onClick: () => {
        console.log("준비 하기");
      },
      theme: "LIGHT",
    },
    {
      title: "준비 취소",
      iconSrc: "",
      onClick: () => {
        console.log("준비취소");
      },
      theme: "LIGHT",
    },
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: () => {
        navigate("/game-list");
        setLeaveGameRoom(true);
      },
      theme: "LIGHT",
    },
  ];
  console.log(roomTitle);
  return (
    <>
      <DS.Container>
        <DS.roomNameBox>{roomTitle}</DS.roomNameBox>
        <ButtonList buttons={roomSettingButtons} />
        <DS.boxWrapper>
          <DS.TitleBox>내 전적</DS.TitleBox>
          <RateDoughnutChart userData={userData} />
          <br />
          <ButtonList buttons={iconButtons} />
        </DS.boxWrapper>
      </DS.Container>
    </>
  );
};

export default GameSideBar;
