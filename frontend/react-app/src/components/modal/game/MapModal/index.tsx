import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  gameModalState,
  gameRoomChatListState,
  gameRoomInfoInitState,
  gameRoomInfoState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import { IconButton } from "@src/components/buttons";
import PongGame from "../pongGame/pongGame";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocket } from "@src/router/socket/gameSocket";
import { userDataState } from "@src/recoil/atoms/common";

interface MapModalProps {
  gameEndingMessage: string;
  setGameEndingMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MapModal = ({
  gameEndingMessage,
  setGameEndingMessage,
}: MapModalProps) => {
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [user] = useRecoilState(userDataState);
  const setGameModal = useSetRecoilState(gameModalState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [user1Score, setUser1Score] = useState<number>(0);
  const [user2Score, setUser2Score] = useState<number>(0);
  const user1 = gameRoomInfo.participants[0].user;
  const user2 = gameRoomInfo.participants[1].user;
  const navigate = useNavigate();

  useEffect(() => {
    if (gameEndingMessage === "") return;
    setTimeout(() => {
      setGameEndingMessage("");
      setGameModal({ gameMap: null });
      if (gameRoomInfo.roomType === "RANKING") {
        setGameRoomInfo(gameRoomInfoInitState);
        setGameRoomURL("");
        setTimeout(() => {
          navigate("/game-list");
        });
      } else {
        setGameRoomChatList((prev) =>
          prev.filter((chat) => chat.userId !== "SYSTEM"),
        );
      }
    }, 3000);
  }, [gameEndingMessage]);

  useEffect(() => {
    gameSocket.on("gameScore", (data) => {
      if (data.gameRoomURL !== gameRoomURL) return;
      setUser1Score(data.user1Score);
      setUser2Score(data.user2Score);
    });
  });

  const surrender = () => {
    console.log("항복");
    gameSocket.emit("surrenderGame", {
      gameRoomURL: gameRoomURL,
      userId: user.id,
    });
  };

  return (
    <S.MapsWrapper>
      <S.GameInfoContainer>
        <S.GameInfoPlayer>
          <S.GameInfoPlayerImage src={user1.avatarPath} />
          <S.GameInfoPlayerInfo>
            <S.GameInfoPlayerInfoNickname>
              {user1.nickname}
            </S.GameInfoPlayerInfoNickname>
            <S.GameInfoPlayerInfoScore>{user1Score}</S.GameInfoPlayerInfoScore>
          </S.GameInfoPlayerInfo>
        </S.GameInfoPlayer>
        <S.GameInfoMiddle>
          {gameEndingMessage === "" ? (
            <S.GameInfoMiddleTop>
              <IconButton onClick={surrender} title="항복" theme="DARK" />
            </S.GameInfoMiddleTop>
          ) : (
            <S.GameInfoMiddleTop />
          )}
          <S.GameInfoMiddleCenter>VS</S.GameInfoMiddleCenter>
        </S.GameInfoMiddle>
        <S.GameInfoPlayer>
          <S.GameInfoPlayerInfo>
            <S.GameInfoPlayerInfoNickname>
              {user2.nickname}
            </S.GameInfoPlayerInfoNickname>
            <S.GameInfoPlayerInfoScore>{user2Score}</S.GameInfoPlayerInfoScore>
          </S.GameInfoPlayerInfo>
          <S.GameInfoPlayerImage src={user2.avatarPath} />
        </S.GameInfoPlayer>
      </S.GameInfoContainer>
      <S.MapsContainer>
        {gameEndingMessage === "" ? (
          <PongGame />
        ) : (
          <>
            <S.GameEndingMessageContainer>
              <p>{gameEndingMessage}</p>
              <p>게임을 저장하고 있습니다.</p>
              <p>
                잠시 후
                {gameRoomInfo.roomType === "RANKING"
                  ? " 게임 목록"
                  : " 대기 방"}
                으로 이동합니다.
              </p>
            </S.GameEndingMessageContainer>
          </>
        )}
      </S.MapsContainer>
    </S.MapsWrapper>
  );
};

export default MapModal;
