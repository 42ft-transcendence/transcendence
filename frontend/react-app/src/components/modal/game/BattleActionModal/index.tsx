import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { battleActionModalState } from "@src/recoil/atoms/modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import { UserType } from "@src/types";
import { useNavigate } from "react-router-dom";
import { userDataState } from "@src/recoil/atoms/common";
import { acceptBattle } from "@src/api/game";
import { gameAcceptUser, gameRoomInfoState } from "@src/recoil/atoms/game";

const BattleActionModal = () => {
  const [battleActionModal, setBattleActionModal] = useRecoilState(
    battleActionModalState,
  );
  const [myData] = useRecoilState(userDataState);
  // const [showProfile, setShowProfile] = useRecoilState(showProfileState);
  const [gameUser, setGameUser] = useRecoilState(gameAcceptUser);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const navigate = useNavigate();
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
      ...BattleActionModal,
      battleActionModal: false,
      awayUser: {} as UserType,
      gameRoomURL: "",
    }); // 모달 닫기
  };

  const handleCancelButton = () => {
    // 대전 신청 거절 api 호출
    console.log("대전 신청 거절");
    setBattleActionModal({
      battleActionModal: false,
      awayUser: {} as UserType,
      gameRoomURL: "",
    }); // 모달 닫기
  };

  const handleAcceptButton = async () => {
    // 대전 신청 수락 api 호출
    console.log("대전 신청 수락");

    // 대전 신청 수락 시 대전 정보 저장
    setGameRoomInfo({
      roomURL: battleActionModal.gameRoomURL,
      roomName: "",
      roomHome: myData,
      roomAway: battleActionModal.awayUser,
      homeReady: false,
      awayReady: false,
    });
    await acceptBattle(
      myData,
      battleActionModal.awayUser,
      battleActionModal.gameRoomURL,
    )
      .then((res) => {
        console.log("대전 신청 수락 api 호출 결과: ", res);
        const gameRoomURL = battleActionModal.gameRoomURL;
        console.log("gameUser", battleActionModal.awayUser);
        setGameUser(battleActionModal.awayUser);
        setBattleActionModal({
          battleActionModal: false,
          awayUser: {} as UserType,
          gameRoomURL: "",
        }); // 모달 닫기
        // 대전 신청 수락 시 대전 페이지로 이동
        navigate("/game/" + gameRoomURL);
      })
      .catch((err) => {
        console.log("대전 신청 수락 api 호출 에러: ", err);
      });
  };

  useEffect(() => {
    console.log("battleActionModal", battleActionModal);
  });

  return (
    <S.ModalWrapper>
      <S.Container>
        <S.Title>
          {" "}
          {battleActionModal.awayUser.nickname}님 께서 대전을 신청하셨습니다.
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
