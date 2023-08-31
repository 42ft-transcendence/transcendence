import { changeNicknameModalState } from "@src/recoil/atoms/modal";
import Modal from "react-modal";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import InputBox from "@src/components/inputBox";
import { useEffect, useState } from "react";
import { checkNickname, setNickname } from "@src/api";
import { userDataState } from "@src/recoil/atoms/common";

export const ChangeNicknameModal = () => {
  const setUserData = useSetRecoilState(userDataState);
  const [changeNicknameModal, setChangeNicknameModal] = useRecoilState(
    changeNicknameModalState,
  );
  const [changeNickname, setChangeNickname] = useState<string>("");
  const [validateNickname, setValidateNickname] = useState<boolean>(true); // 닉네임 중복 여부
  const [validateMessage, setValidateMessage] = useState<string>(""); // 닉네임 중복 여부 메시지

  const onNicknameChange = (value: string) => {
    setChangeNickname(value);
  };

  const uploadNickName = async (changeNickname: string) => {
    try {
      const checkNicknameResponse = await checkNickname(changeNickname);
      if (checkNicknameResponse.data.status === 400) {
        return checkNicknameResponse;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await setNickname(changeNickname);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.status !== 201) {
        throw response;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setUserData(response.data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValidateNickname(false);
      void error;
    }
  };

  const onConfirm = () => {
    uploadNickName(changeNickname)
      .then((response) => {
        if (response?.data.status === 400) {
          throw response;
        }
        setChangeNicknameModal(false);
      })
      .catch((error) => {
        setValidateNickname(false);
        setValidateMessage(error.data.message);
        console.error("error: ", error);
      });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await checkNickname(changeNickname);
        if (response.data.status === 200) {
          setValidateNickname(true);
          setValidateMessage("사용 가능한 닉네임입니다.");
        } else {
          setValidateNickname(false);
          changeNickname === ""
            ? setValidateMessage("")
            : setValidateMessage(
                typeof response.data.message !== "string"
                  ? ""
                  : response.data.message,
              );
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    })().catch((error) => {
      console.error("Error: ", error);
    });
  }, [changeNickname]);

  return (
    <Modal
      isOpen={changeNicknameModal}
      style={{
        content: { ...S.ModalContent },
        overlay: { ...S.ModalOverlay },
      }}
    >
      <S.ModalTitle>닉네임 변경</S.ModalTitle>
      <InputBox onChange={onNicknameChange} onKeyPress={onConfirm} />
      <S.DuplicatedNicknameText $validated={validateNickname}>
        {validateMessage}
      </S.DuplicatedNicknameText>
      <S.ButtonContainer>
        <IconButton
          title="취소"
          onClick={() => setChangeNicknameModal(false)}
          theme="LIGHT"
        />
        <IconButton title="변경" onClick={onConfirm} theme="LIGHT" />
      </S.ButtonContainer>
    </Modal>
  );
};
