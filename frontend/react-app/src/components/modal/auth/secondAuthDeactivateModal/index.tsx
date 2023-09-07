import { IconButton } from "@components/buttons";
import { secondAuthDeactivateModalState } from "@src/recoil/atoms/modal";
import { getUser, turnOff2Fa } from "@src/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as S from "./index.styled";
import { userDataState } from "@src/recoil/atoms/common";

const SecondAuthDeactivateModal = () => {
  const [isOpened, setIsOpened] = useRecoilState(
    secondAuthDeactivateModalState,
  );
  const setUserData = useSetRecoilState(userDataState);

  const handleClose = () => {
    getUser()
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    setIsOpened(false);
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  });

  const handleDeactivate = () => {
    turnOff2Fa()
      .then(() => {
        handleClose();
        setUserData((prev) => ({
          ...prev,
          isTwoFactorAuthenticationEnabled: false,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!isOpened) return null;
  return (
    <>
      <S.Overlay onClick={handleClose} />
      <S.Container>
        <S.Title>2차인증을 해제하시겠습니까?</S.Title>
        <S.ButtonContainer>
          <IconButton title="유지" theme="LIGHT" onClick={handleClose} />
          <IconButton title="해제" theme="LIGHT" onClick={handleDeactivate} />
        </S.ButtonContainer>
      </S.Container>
    </>
  );
};

export default SecondAuthDeactivateModal;
