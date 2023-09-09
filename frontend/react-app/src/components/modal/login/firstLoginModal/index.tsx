import React from "react";
import * as S from "./index.styled";

interface FirstLoginModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FirstLoginModal = ({ isOpen, setIsOpen }: FirstLoginModalProps) => {
  if (!isOpen) return <></>;

  return (
    <S.ModalOverlay onClick={() => setIsOpen(false)}>
      <S.ModalContent>
        <p>환영합니다!</p>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default FirstLoginModal;
