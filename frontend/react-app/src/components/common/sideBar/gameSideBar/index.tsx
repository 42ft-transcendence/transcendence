import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState, gameRoomURLState } from "@src/recoil/atoms/game";
import { gameSocket } from "@src/router/socket/gameSocket";
import GameEditModal from "@src/components/modal/game/gameEditModal";
import { gameModalState } from "@src/recoil/atoms/game";
import { GameMapType } from "@src/types/game.type";
import NormalMap from "@src/components/modal/game/maps/normal";

interface GameSideBarProps {
  isReady: boolean;
}

const GameSideBar = ({ isReady }: GameSideBarProps) => {
  const [userData] = useRecoilState(userDataState);
  const [, setLeaveGameRoom] = useState(false);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
  const navigate = useNavigate();

  const iconButtons: IconButtonProps[] = [
    {
      title: "방 설정하기",
      iconSrc: "",
      onClick: () => {
        setIsEditModalOpen(true);
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

    const finalButtons =
      gameRoomInfo.roomOwner.id !== userData.id
        ? newButtons.filter((button) => button.title !== "방 설정하기")
        : newButtons;

    setfilteredIconButtons(finalButtons);
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
                gameSocket.emit("startGameTest", {
                  gameRoomURL: gameRoomURL,
                });
              },
              theme: "LIGHT",
            },
          ]}
        />
        {/* <DS.TitleBox>내 전적</DS.TitleBox>
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
        <br /> */}
        {/* 모달 영역 */}
        <GameEditModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          gameRoomInfo={gameRoomInfo}
        />
        {/* gameMapModal test */}
        {gameModal.gameMap === "NORMAL" && <NormalMap />}
      </DS.Container>
    </>
  );
};

export default GameSideBar;
