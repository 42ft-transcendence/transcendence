import { useEffect, useState } from "react";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { gameRoomListState } from "@src/recoil/atoms/game";
import { GameRoomInfoType, GameRoomStatus } from "@src/types/game.type";
import SearchBar from "@components/common/searchBar";

interface GameListContentProps {
  setSelectGameRoom: React.Dispatch<
    React.SetStateAction<GameRoomInfoType | undefined>
  >;
  setIsOpenEnterModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameListContent = ({
  setSelectGameRoom,
  setIsOpenEnterModal,
}: GameListContentProps) => {
  const [search, setSearch] = useState<string>("");
  const [gameRoomList] = useRecoilState(gameRoomListState);
  const [filteredRoomList, setFilteredRoomList] = useState<GameRoomInfoType[]>(
    [],
  );
  const [sortState, setSortState] = useState<string>("전체 방");

  const handleOnClick = (props: GameRoomInfoType) => {
    console.log("게임 방 클릭", props);
    setSelectGameRoom(props);
    setIsOpenEnterModal(true);
  };

  useEffect(() => {
    const searchedRoomList = gameRoomList.filter((room) =>
      room.roomName.includes(search),
    );
    if (sortState === "전체 방") {
      setFilteredRoomList(
        searchedRoomList.filter((room) => room.roomType !== "PRIVATE"),
      );
    } else if (sortState === "공개 방") {
      setFilteredRoomList(
        searchedRoomList.filter((room) => room.roomType === "PUBLIC"),
      );
    } else if (sortState === "비밀 방") {
      setFilteredRoomList(
        searchedRoomList.filter((room) => room.roomType === "PROTECTED"),
      );
    }
  }, [gameRoomList, search, sortState]);

  return (
    <DS.ContentArea>
      <SearchBar
        id="gameListSearch"
        search={search}
        setSearch={setSearch}
        sortState={sortState}
        setSortState={setSortState}
        sortOptions={["전체 방", "공개 방", "비밀 방"]}
        placeholder="방 이름을 입력하세요"
      />
      <S.GameRoomCardContainer>
        {filteredRoomList.map((gameRoom) => (
          <S.GameRoomCard
            key={gameRoom.roomURL}
            $roomType={gameRoom.roomType}
            onClick={() => {
              if (gameRoom.status === GameRoomStatus.GAMING) return;
              handleOnClick(gameRoom);
            }}
          >
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
