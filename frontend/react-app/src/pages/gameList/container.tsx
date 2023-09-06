import { useState } from "react";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { SearchComponent } from "../userList/container";
import { useRecoilState } from "recoil";
import { gameRoomListState } from "@src/recoil/atoms/game";
import { GameRoomStatus } from "@src/types/game.type";

export const GameListContent = () => {
  const [search, setSearch] = useState<string>("");
  const [gameRoomList] = useRecoilState(gameRoomListState);
  const [sortState, setSortState] = useState<string>("전체 방");

  return (
    <DS.ContentArea>
      <SearchComponent
        search={search}
        setSearch={setSearch}
        sortState={sortState}
        setSortState={setSortState}
        placeholder="방 이름을 입력하세요"
      />
      <S.GameRoomCardContainer>
        {gameRoomList
          .filter(
            (gameRoom) =>
              gameRoom.roomType === "PUBLIC" ||
              gameRoom.roomType === "PROTECTED",
          )
          .map((gameRoom) => (
            <S.GameRoomCard key={gameRoom.roomURL} roomType={gameRoom.roomType}>
              <S.GameRoomCardLeft>
                <S.GameRoomTitle>
                  {gameRoom.roomName !== "" ? gameRoom.roomName : "빠른 대전"}
                </S.GameRoomTitle>
                <S.GameRoomOption>
                  {gameRoom.map} | {gameRoom.gameMode} |{" "}
                  {gameRoom.roomOwner.nickname}
                </S.GameRoomOption>
              </S.GameRoomCardLeft>
              <S.GameRoomCardRight>
                <S.GameRoomNumOfPeople>
                  {gameRoom.numberOfParticipants} / 2
                </S.GameRoomNumOfPeople>
                <S.GameRoomStatus>
                  {gameRoom.status === GameRoomStatus.WAITING
                    ? "대기중"
                    : "게임중"}
                </S.GameRoomStatus>
              </S.GameRoomCardRight>
            </S.GameRoomCard>
          ))}
      </S.GameRoomCardContainer>
    </DS.ContentArea>
  );
};
