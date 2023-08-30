import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createGameRoomModalState } from "@src/recoil/atoms/modal";

const GameSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  // const [, setCreateGameRoom] = useRecoilState(createGameRoomModalState);
  const [, setLeaveGameRoom] = useState(false);
  const navigate = useNavigate();
  const iconButtons: IconButtonProps[] = [
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: () => {
        navigate("/game-list");
        setLeaveGameRoom(true);
      },
      theme: "LIGHT",
    },
    // {
    //   title: "준비하기",
    //   iconSrc: "",
    //   onClick: () => {
    //     console.log("랭킹전 참가");
    //   },
    //   theme: "LIGHT",
    // },
    // {
    //   title: "둘러보기",
    //   iconSrc: "",
    //   onClick: () => {
    //     console.log("둘러보기");
    //   },
    //   theme: "LIGHT",
    // },
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

export default GameSideBar;
