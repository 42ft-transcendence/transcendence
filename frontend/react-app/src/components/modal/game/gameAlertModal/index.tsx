import { gameAlertModalState } from "@src/recoil/atoms/modal";
import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  gameRoomInfoInitState,
  gameRoomInfoState,
} from "@src/recoil/atoms/game";
import { IconButton } from "@src/components/buttons/index";

const GameAlertModal = () => {
  const [gameAlertModal, setGameAlertModal] =
    useRecoilState(gameAlertModalState);
  const setGameRoomInfo = useSetRecoilState(gameRoomInfoState);

  const navigate = useNavigate();
  const handleCloseModal = () => {
    setGameAlertModal((prev) => ({
      ...prev,
      gameAlertModal: false,
      gameAlertModalMessage: "",
    }));
    if (gameAlertModal.shouldInitInfo) {
      setGameRoomInfo(gameRoomInfoInitState);
      setGameAlertModal((prev) => ({
        ...prev,
        shouldInitInfo: false,
      }));
    }
    if (gameAlertModal.shouldRedirect) {
      setGameAlertModal((prev) => ({
        ...prev,
        shouldRedirect: false,
      }));
      navigate("/game-list");
    }
  };

  return (
    <Modal
      isOpen={true}
      style={{
        content: S.ModalContent,
        overlay: S.ModalOverlay,
      }}
    >
      <S.ModalMessage>{gameAlertModal.gameAlertModalMessage}</S.ModalMessage>
      <IconButton
        title="닫기"
        onClick={() => handleCloseModal()}
        theme="LIGHT"
      />
    </Modal>
  );
};

export default GameAlertModal;
