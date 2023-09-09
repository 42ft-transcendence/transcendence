import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameModalState, gameRoomInfoState } from "@src/recoil/atoms/game";
import { IconButton } from "@src/components/buttons";
import PongGame from "../pongGame/pongGame";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MapModalProps {
  gameEndingMessage: string;
  setGameEndingMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MapModal = ({
  gameEndingMessage,
  setGameEndingMessage,
}: MapModalProps) => {
  const setGameModal = useSetRecoilState(gameModalState);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
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
      setTimeout(() => {
        navigate("/game-list");
      });
    }, 3000);
  }, [gameEndingMessage]);

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
          <S.GameInfoMiddleTop>
            <IconButton
              onClick={() => {
                setGameModal({ gameMap: null });
              }}
              title="항복"
              theme="DARK"
            />
          </S.GameInfoMiddleTop>
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
          <PongGame
            setUser1Score={setUser1Score}
            setUser2Score={setUser2Score}
          />
        ) : (
          <>
            <S.GameEndingMessageContainer>
              <p>{gameEndingMessage}</p>
              <p>게임을 저장하고 있습니다.</p>
              <p>잠시 뒤 게임 목록으로 이동합니다.</p>
            </S.GameEndingMessageContainer>
          </>
        )}
      </S.MapsContainer>
    </S.MapsWrapper>
  );
};

export default MapModal;
