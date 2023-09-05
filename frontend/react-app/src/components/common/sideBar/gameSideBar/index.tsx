import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import { gameModalState } from "@src/recoil/atoms/game";
import { GameMapType } from "@src/types/game.type";
import NormalMap from "@src/components/modal/game/maps/normal";

const GameSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const [, setCreateGameRoom] = useRecoilState(createGameRoomModalState);
  const [gameModal, setGameModal] = useRecoilState(gameModalState);

  const iconButtons: IconButtonProps[] = [
    {
      title: "방 만들기",
      iconSrc: "",
      onClick: () => setCreateGameRoom(true),
      theme: "LIGHT",
    },
    {
      title: "랭킹전 참가",
      iconSrc: "",
      onClick: () => {
        console.log("랭킹전 참가");
      },
      theme: "LIGHT",
    },
    {
      title: "둘러보기",
      iconSrc: "",
      onClick: () => {
        console.log("둘러보기");
      },
      theme: "LIGHT",
    },
  ];

  return (
    <DS.Container>
      <ButtonList buttons={iconButtons} />
      <br />
      <DS.TitleBox>내 전적</DS.TitleBox>
      <RateDoughnutChart userData={userData} />
      <br />
      <ButtonList
        buttons={[
          {
            title: "게임 맵 테스트",
            iconSrc: "",
            onClick: () => {
              setGameModal({ ...gameModal, gameMap: "NORMAL" as GameMapType });
              console.log("게임 맵 테스트");
            },
            theme: "LIGHT",
          },
        ]}
      />
      {/* gameMapModal test */}
      {gameModal.gameMap === "NORMAL" && <NormalMap />}
    </DS.Container>
  );
};

export default GameSideBar;
