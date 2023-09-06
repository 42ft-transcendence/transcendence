import { useState } from "react";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { SearchComponent } from "../userList/container";
import { useRecoilState } from "recoil";
import { gameRoomListState } from "@src/recoil/atoms/game";

export const GameListContent = () => {
  const [search, setSearch] = useState<string>("");
  const [gameRoomList, setGameRoomList] = useRecoilState(gameRoomListState);
  const [sortState, setSortState] = useState<string>("전체 방");
  // const [numberOfPeople, setNumberOfPeople] = useState<number>();

  console.log("gameRoomList", gameRoomList);

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
            <S.GameRoomCard key={gameRoom.roomURL}>
              <S.GameRoomCardLeft>
                <S.GameRoomTitle>
                  {gameRoom.roomName !== "" ? gameRoom.roomName : "빠른 대전"}
                </S.GameRoomTitle>
                {/* 향후 맵 추가 */}
                {/* <S.GameRoomOption>
                일반 | {gameRoom.homeUser.nickname}
              </S.GameRoomOption> */}
              </S.GameRoomCardLeft>
              <S.GameRoomCardRight>
                <S.GameRoomNumOfPeople>
                  {/* {}{" "} */}/ 2
                </S.GameRoomNumOfPeople>
                <S.GameRoomStatus>대기중</S.GameRoomStatus>
              </S.GameRoomCardRight>
            </S.GameRoomCard>
          ))}
      </S.GameRoomCardContainer>
    </DS.ContentArea>
  );
};
