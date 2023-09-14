import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { gameRoomListState } from "@src/recoil/atoms/game";
import { GameRoomInfoType } from "@src/types/game.type";
import SearchList from "@components/common/search/searchList";
import GameRoomCard from "@components/common/search/gameRoomCard";

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
    const searchedRoomList = gameRoomList
      .filter((room) => room.roomName.includes(search))
      .filter((room) => room.roomType !== "CREATING");
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
    <SearchList
      searchBar={{
        id: "gameListSearch",
        search,
        setSearch,
        sortState,
        setSortState,
        sortOptions: ["전체 방", "공개 방", "비밀 방"],
        placeholder: "방 이름을 입력하세요",
      }}
    >
      {filteredRoomList.map((gameRoom) => (
        <GameRoomCard
          key={gameRoom.roomURL}
          gameRoom={gameRoom}
          handleOnClick={handleOnClick}
        />
      ))}
    </SearchList>
  );
};
