import { gameAlertModalState } from "@src/recoil/atoms/modal";
import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { UserType } from "@src/types";
import { IconButton } from "@src/components/buttons/index";

const GameAlertModal = () => {
  const [gameAlertModal, setGameAlertModal] =
    useRecoilState(gameAlertModalState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);

  const navigate = useNavigate();
  const handleCloseModal = () => {
    setGameAlertModal((prev) => ({
      ...prev,
      gameAlertModal: false,
      gameAlertModalMessage: "",
    }));
    if (gameAlertModal.shouldInitInfo) {
      setGameRoomInfo({
        roomURL: "",
        roomName: "",
        homeUser: {} as UserType,
        awayUser: {} as UserType,
        homeReady: false,
        awayReady: false,
        gameType: "",
      });
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
