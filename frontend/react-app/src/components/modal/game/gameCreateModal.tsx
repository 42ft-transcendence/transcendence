import Modal from "react-modal";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import React, { useState } from "react";

const GameCreateModal = () => {
  const [createGameRoom, setCreateGameRoom] = useRecoilState(
    createGameRoomModalState,
  );

  const [roomTitle, setRoomTitle] = useState("");
  // const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomTitle(event.target.value);
  };

  return (
    <Modal
      isOpen={createGameRoom}
      onRequestClose={() => setCreateGameRoom(false)}
      style={{
        content: { ...S.ModalContent }, // Spread 연산자 사용
        overlay: { ...S.ModalOverlay }, // Spread 연산자 사용
      }}
    >
      <S.InputBoxWrapper
        type="text"
        placeholder="방 제목"
        id="nickname"
        value={roomTitle}
        onChange={handleTitleChange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            // 엔터키를 누르면
            // onKeyPress(); // 부모 컴포넌트로 엔터키를 눌렀음을 전달
          }
        }}
        // 글자 수 제한
        maxLength={23}
      />
      {/* <S.gameCreateModalTitle>방 만들기</S.gameCreateModalTitle>
      <S.gameCreateModalLabel>방 제목</S.gameCreateModalLabel>
      <S.gameCreateModalInput
      // type="text"
      // value={roomTitle} // 방 제목 값 연결
      // onChange={(e) => setRoomTitle(e.target.value)} // 방 제목 변경 핸들러
      // placeholder="방 제목을 입력하세요"
      />
      <S.gameCreateModalButton onClick={() => setCreateGameRoom(false)}>
        닫기
      </S.gameCreateModalButton> */}
    </Modal>
  );
};
export default GameCreateModal;
