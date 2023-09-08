import Modal from "react-modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import LoadingImage from "@src/assets/images/loading.gif";

interface RankGameWatingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const RankGameWatingModal = ({
  isOpen,
  setIsOpen,
}: RankGameWatingModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: S.ModalContent,
      }}
    >
      <div>매칭 대기중</div>
      <S.LoadingImageStyle src={LoadingImage} />
      <IconButton title="취소" onClick={() => setIsOpen(false)} theme="LIGHT" />
    </Modal>
  );
};
