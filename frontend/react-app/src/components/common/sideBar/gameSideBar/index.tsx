import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  gameRoomInfoInitState,
  gameRoomInfoState,
} from "@src/recoil/atoms/game";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { exitGameRoom, readyCancleSignal, readySignal } from "@src/api";
import { GameMapType } from "@src/types/game.type";
import NormalMap from "@src/components/modal/game/maps/normal";
import { gameModalState } from "@src/recoil/atoms/game";

const GameSideBar = () => {
  const [, setLeaveGameRoom] = useState(false);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  // console.log("gameRoomInfo", gameRoomInfo);
  const [userData] = useRecoilState(userDataState);
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
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
        console.log("준비하기", userData, gameRoomInfo);
        await readySignal(gameRoomInfo.roomURL, userData);
        if (gameRoomInfo.homeUser.id === userData.id) {
          setGameRoomInfo({
            ...gameRoomInfo,
            homeReady: true,
          });
        } else {
          setGameRoomInfo({
            ...gameRoomInfo,
            awayReady: true,
          });
        }
      },
      theme: "LIGHT",
    },
    {
      title: "준비 취소",
      iconSrc: "",
      onClick: async () => {
        await readyCancleSignal(gameRoomInfo.roomURL, userData);
        if (gameRoomInfo.homeUser.id === userData.id) {
          setGameRoomInfo({
            ...gameRoomInfo,
            homeReady: false,
          });
        } else if (gameRoomInfo.awayUser.id === userData.id) {
          setGameRoomInfo({
            ...gameRoomInfo,
            awayReady: false,
          });
        }
      },
      theme: "LIGHT",
    },
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: async () => {
        setGameRoomInfo(gameRoomInfoInitState);
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
    const newButtons =
      (gameRoomInfo.homeUser.id === userData.id && gameRoomInfo.homeReady) ||
      (gameRoomInfo.awayReady && gameRoomInfo.awayUser.id === userData.id)
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
        <ButtonList
          buttons={[
            {
              title: "게임 맵 테스트",
              iconSrc: "",
              onClick: () => {
                setGameModal({
                  ...gameModal,
                  gameMap: "NORMAL" as GameMapType,
                });
                console.log("게임 맵 테스트");
              },
              theme: "LIGHT",
            },
          ]}
        />
        {/* gameMapModal test */}
        {gameModal.gameMap === "NORMAL" && <NormalMap />}
      </DS.Container>
    </>
  );
};

export default GameSideBar;
