import * as S from "./index.styled";
import RankingIcon from "@assets/icons/ranking.svg";
import loseIcon from "@assets/icons/lose.svg";
import winIcon from "@assets/icons/win.svg";
import { UserType } from "@src/types";
import ReadyIcon from "@assets/icons/ready.svg";
import {
  gameRoomChatListState,
  gameRoomInfoState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { gameSocket } from "@src/router/socket/gameSocket";
import { userDataState } from "@src/recoil/atoms/common";
import { GameChattingType } from "@src/types/game.type";

interface GameMatchProfileProps {
  user: UserType;
  isReady: boolean;
}

export const GameMatchProfile = ({ user, isReady }: GameMatchProfileProps) => {
  const gameRoom = useRecoilValue(gameRoomInfoState);
  return (
    <S.GameMatchBox $isReady={isReady}>
      {isReady && <S.ReadyIcon src={ReadyIcon} />}
      <S.gameRoomProfileImg src={user.avatarPath} />
      {/* <S.UserCardStatus /> */}
      <S.gameRoomProfileNickname>{user.nickname}</S.gameRoomProfileNickname>
      <S.gameRoomProfileRank>
        <S.gameRoomProfileContainer>
          <S.gameRoomProfileRankImg src={RankingIcon} />
          <div>{gameRoom.roomType === "RANKING" ? user.rating : "일반전"}</div>
        </S.gameRoomProfileContainer>
        <S.gameRoomProfileContainer>
          <S.gameRoomProfileRankImg src={winIcon} />
          <div>
            {gameRoom.roomType === "RANKING" ? user.ladder_win : user.win}
          </div>
        </S.gameRoomProfileContainer>
        <S.gameRoomProfileContainer>
          <S.gameRoomProfileRankImg src={loseIcon} />
          <div>
            {gameRoom.roomType === "RANKING" ? user.ladder_lose : user.lose}
          </div>
        </S.gameRoomProfileContainer>
      </S.gameRoomProfileRank>
    </S.GameMatchBox>
  );
};

interface GameChattingBoxProps {
  gameChatting: GameChattingType;
}

const formatDateToKST = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getUTCHours() - 6);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const formatDateToKSTCustomFormat = (dateString: string) => {
  const date = new Date(dateString);
  // 한국 시간으로 조정 (+9시간)
  date.setHours(date.getUTCHours() + 9);

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[date.getUTCDay()];

  const month = date.getUTCMonth() + 1; // 월은 0부터 시작하므로 +1
  const day = date.getUTCDate();

  return `${dayName}, ${month}${day.toString().padStart(2, "0")}`; // 요일, 월, 일을 연결
};

const GameChattingBox = ({ gameChatting }: GameChattingBoxProps) => {
  const gameInfo =
    `┌─( ~/game/` + gameChatting.roomURL.slice(0, 10) + `\u00A0)──`;
  const userInfo1 = `──( `;
  const userInfo2 = `@` + gameChatting.userId + ` )─┐`;

  return (
    <>
      <S.GameChattingBox
        style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
      >
        <span>{gameInfo}</span>
        <span style={{ flexGrow: 1, overflow: "hidden" }}>
          {" ".repeat(100)}
        </span>
        <span>{userInfo1}</span>
        <span style={{ color: "#ff8037" }}>
          {`\u00A0${gameChatting.userNickname}`}
        </span>
        <span>{userInfo2}</span>
      </S.GameChattingBox>
      <S.GameChattingBox style={{ display: "flex", alignItems: "center" }}>
        <span>{`└─(\u00A0`}</span>
        <span style={{ color: "#ff8037" }}>
          {formatDateToKST(gameChatting.createdAt.toString())}
        </span>
        <span style={{ color: "white" }}>{`\u00A0on\u00A0`}</span>
        <span>{gameChatting.roomName + `\u00A0`}</span>
        <span>{`) ──>\u00A0`}</span>
        <span>{gameChatting.message}</span>
        <span style={{ flexGrow: 1, overflow: "hidden" }}>
          {" ".repeat(100)}
        </span>
        <span>{`──(\u00A0`}</span>
        <span style={{ color: "#ff8037" }}>
          {formatDateToKSTCustomFormat(gameChatting.createdAt.toString())}
        </span>
        <span>{`\u00A0)─┘`}</span>
      </S.GameChattingBox>
    </>
  );
};

export const GameChattingContainer = () => {
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL] = useRecoilState(gameRoomURLState);
  const [userData] = useRecoilState(userDataState);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [chattingList, setChattingList] = useRecoilState(gameRoomChatListState);
  const [hasSentEntryMessage, setHasSentEntryMessage] = useState(false);

  useEffect(() => {
    if (userData.id === "0" || hasSentEntryMessage) return;
    if (gameRoomInfo.roomType !== "RANKING" && chattingList.length === 0) {
      gameSocket.emit("sendGameRoomChat", {
        roomURL: gameRoomURL,
        roomName: gameRoomInfo.roomName,
        message: `${userData.nickname}님이 입장하셨습니다.`,
        userId: userData.id,
        userNickname: userData.nickname,
        createdAt: new Date(),
      });
      setHasSentEntryMessage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chattingList, userData]);

  const handleGetGameRoomChat = useCallback(
    (data: GameChattingType) => {
      // 시스템의 채팅이 중복으로 들어오는 것을 방지
      if (gameRoomURL === data.roomURL) {
        if (
          data.userId === "SYSTEM" &&
          chattingList
            .map((chatting) => chatting.message)
            .includes(data.message)
        )
          return;
        setChattingList((prevChattingList) => [...prevChattingList, data]);
      }
    },
    [gameRoomURL, chattingList, setChattingList],
  );

  useEffect(() => {
    // 이벤트 리스너 등록
    gameSocket.on("getGameRoomChat", handleGetGameRoomChat);

    // 클린업 함수
    return () => {
      // 이벤트 리스너 제거
      gameSocket.off("getGameRoomChat", handleGetGameRoomChat);
    };
  }, [handleGetGameRoomChat]);

  useEffect(() => {
    // 매번 chattingList가 업데이트 될 때 스크롤을 아래로 이동
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [chattingList]);

  return (
    <>
      <S.GameChattingContainer ref={messageEndRef}>
        {chattingList.map(
          (chatting, index) =>
            chatting.roomURL === gameRoomURL && (
              <GameChattingBox key={index} gameChatting={chatting} />
            ),
        )}
      </S.GameChattingContainer>
      <GameChattingInputBox />
    </>
  );
};

const GameChattingInputBox = () => {
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [inputText, setInputText] = useState("");
  const [userData] = useRecoilState(userDataState);
  const [gameRoomURL] = useRecoilState(gameRoomURLState);

  const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendText = () => {
    if (inputText === "") return;
    gameSocket.emit("sendGameRoomChat", {
      roomURL: gameRoomURL,
      roomName: gameRoomInfo.roomName,
      message: inputText,
      userId: userData.id,
      userNickname: userData.nickname,
      createdAt: new Date(),
    });
    setInputText("");
  };

  return (
    <S.GameChattingInputBox>
      <S.GameChattingInput
        placeholder="채팅을 입력하세요"
        value={inputText}
        onChange={handleInputText}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSendText();
        }}
      />
      <S.GameChattingSendButton onClick={handleSendText}>
        전송
      </S.GameChattingSendButton>
    </S.GameChattingInputBox>
  );
};
