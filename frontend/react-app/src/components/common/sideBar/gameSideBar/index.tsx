import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState, gameRoomURLState } from "@src/recoil/atoms/game";
import { gameSocket } from "@src/router/socket/gameSocket";
import GameEditModal from "@src/components/modal/game/gameEditModal";
import { gameModalState } from "@src/recoil/atoms/game";
import { RankGameExitModal } from "@src/components/modal/game/rankGameExitModal";
import { isOpenRankGameWatingModalState } from "@src/recoil/atoms/modal";
import MapModal from "@src/components/modal/game/MapModal";

interface GameSideBarProps {
  isReady: boolean;
}

const GameSideBar = ({ isReady }: GameSideBarProps) => {
  const [userData] = useRecoilState(userDataState);
  const [, setLeaveGameRoom] = useState(false);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
  const setIsOpenRankGameWatingModal = useSetRecoilState(
    isOpenRankGameWatingModalState,
  );
  const [gameEndingMessage, setGameEndingMessage] = useState("");
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
      onClick: () => {
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

  const rankMatchIconButtons: IconButtonProps[] = [
    {
      title: "방 나가기",
      iconSrc: "",
      onClick: () => {
        setIsExitModalOpen(true);
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

  useEffect(() => {
    gameSocket.on("exitRankGameRoom", (data) => {
      if (data.gameRoomURL !== gameRoomURL) return;
      setGameRoomURL("");
      setGameModal({ gameMap: null });
      if (data.exitUser.id === userData.id) {
        navigate("/game-list");
        return;
      }
      setIsOpenRankGameWatingModal(true);
      setTimeout(() => {
        gameSocket.emit("joinRankGame", {
          user: userData,
        });
      }, 3000);
      navigate("/game-list");
    });
  });

  gameSocket.on("finishedRankGame", (data) => {
    console.log("finishedRankGame", data);
    if (data.gameRoomURL !== gameRoomURL) return;
    const participants = gameRoomInfo.participants;
    const winner = participants[data.winner];
    if (winner.user.id === userData.id) {
      setGameEndingMessage("승리하셨습니다.");
    } else {
      setGameEndingMessage("패배하셨습니다.");
    }
  });

  return (
    <>
      <DS.Container>
        {gameRoomInfo.roomType !== "RANKING" ? (
          <>
            <DS.roomNameBox>
              {gameRoomInfo.roomName === ""
                ? "빠른 대전"
                : gameRoomInfo.roomName}
            </DS.roomNameBox>
            <br />
            <ButtonList buttons={filteredIconButtons} />
            <br />
          </>
        ) : (
          <>
            <DS.roomNameBox>{gameRoomInfo.roomName}</DS.roomNameBox>
            <br />
            <ButtonList buttons={rankMatchIconButtons} />
            <br />
            <S.RoomInfoBox>게임 정보</S.RoomInfoBox>
            <br />
            <S.RoomInfoBox>
              맵 : {gameRoomInfo.map === "NORMAL" ? " 일반" : " 정글"}
            </S.RoomInfoBox>
            <S.RoomInfoBox>
              속도 :
              {gameRoomInfo.gameMode === "NORMAL"
                ? " 보통"
                : gameRoomInfo.gameMode === "FAST"
                ? " 빠름"
                : " 느림"}
            </S.RoomInfoBox>
          </>
        )}
        {/* 모달 영역 */}
        <GameEditModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          gameRoomInfo={gameRoomInfo}
        />
        {/* gameMapModal test */}
        {gameRoomInfo.participants.length === 2 &&
          gameModal.gameMap === "NORMAL" && (
            <MapModal
              gameEndingMessage={gameEndingMessage}
              setGameEndingMessage={setGameEndingMessage}
            />
          )}
      </DS.Container>
      <RankGameExitModal
        isOpen={isExitModalOpen}
        setIsOpen={setIsExitModalOpen}
      />
    </>
  );
};

export default GameSideBar;
