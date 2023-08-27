import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { battleActionModalState } from "../../../recoil/atoms/modal";
import * as S from "./index.styled.ts";
import { IconButton } from "../../Buttons";
import { userDataState } from "@src/recoil/atoms/common/index.ts";

const BattleActionModal = () => {
  const [battleActionModal, setBattleActionModal] = useRecoilState(
    battleActionModalState,
  );
  const [countdown, setCountdown] = useState(30);
  const [countdownInterval, setCountdownInterval] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (battleActionModal) {
      setCountdown(5);
      startCountdown();
    }
  }, [battleActionModal]);

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(interval);
          closeModal(); // 모달 닫기 함수 호출
        }
        return prevCountdown - 1;
      });
    }, 1000);
    setCountdownInterval(interval);
  };

  const closeModal = () => {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }
    setBattleActionModal({
      battleActionModal: false,
      nickname: "",
    }); // 모달 닫기
  };

  const handleCancelButton = () => {
    // 대전 신청 거절 api 호출
    console.log("대전 신청 거절");
    setBattleActionModal({
      battleActionModal: false,
      nickname: "",
    }); // 모달 닫기
  };

  const handleAcceptButton = () => {
    // 대전 신청 수락 api 호출
    console.log("대전 신청 수락");
    setBattleActionModal({
      battleActionModal: false,
      nickname: "",
    }); // 모달 닫기
    // 대전 신청 수락 시 대전 페이지로 이동
  };

  return (
    <S.ModalWrapper>
      <S.Container>
        <S.Title>
          {" "}
          {battleActionModal.nickname}님 께서 대전을 신청하셨습니다.
        </S.Title>
        <S.Title>{countdown}</S.Title>
        <S.ButtonContainer>
          <IconButton title="거절" theme="LIGHT" onClick={handleCancelButton} />
          <IconButton title="참여" theme="LIGHT" onClick={handleAcceptButton} />
        </S.ButtonContainer>
      </S.Container>
    </S.ModalWrapper>
  );
};

export default BattleActionModal;
