// import * as DS from "../index.styled";
import * as S from "./index.styled";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { gameModalState } from "@src/recoil/atoms/game";
import { GameMapType } from "@src/types/game.type";

const NormalMap = () => {
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
  return (
    <Modal
      isOpen={gameModal.gameMap === ("NORMAL" as GameMapType)}
      onRequestClose={() => setGameModal({ ...gameModal, gameMap: null })}
      style={{
        content: { ...S.ModalContent }, // Spread 연산자 사용
        overlay: { ...S.ModalOverlay }, // Spread 연산자 사용
      }}
    ></Modal>
  );
};

export default NormalMap;
