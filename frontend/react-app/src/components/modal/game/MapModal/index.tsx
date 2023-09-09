import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameModalState, gameRoomInfoState } from "@src/recoil/atoms/game";
import { IconButton } from "@src/components/buttons";
import PongGame from "../pongGame/pongGame";
import { useState } from "react";

const MapModal = () => {
  const setGameModal = useSetRecoilState(gameModalState);
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [user1Score, setUser1Score] = useState<number>(0);
  const [user2Score, setUser2Score] = useState<number>(0);
  const user1 = gameRoomInfo.participants[0].user;
  const user2 = gameRoomInfo.participants[1].user;

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
        <PongGame setUser1Score={setUser1Score} setUser2Score={setUser2Score} />
      </S.MapsContainer>
    </S.MapsWrapper>
  );
};

export default MapModal;
