import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
// import React, { useState } from "react";

const GameCreateModal = () => {
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );

  // const [roomTitle, setRoomTitle] = useState("");
  // const [isEditingTitle, setIsEditingTitle] = useState(false);

  // const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRoomTitle(event.target.value);
  // };

  return (
    <Modal
      isOpen={createGameRoom}
      onRequestClose={() => setCreateGameRoom(false)}
      style={{
        content: { ...S.ModalContent }, // Spread 연산자 사용
        overlay: { ...S.ModalOverlay }, // Spread 연산자 사용
      }}
    >
      {/* <S.gameCreateModalOverlay> */}
      {/* <S.gameCreateModalContent>하이</S.gameCreateModalContent> */}
      {/* </S.gameCreateModalOverlay> */}
    </Modal>
  );
};

export default GameCreateModal;
