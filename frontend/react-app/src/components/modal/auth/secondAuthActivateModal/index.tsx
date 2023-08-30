import { generate2FaLink, getUser, turnOn2Fa } from "@src/api";
import { userDataState } from "@src/recoil/atoms/common";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import Loading from "@assets/images/loading.gif";

export interface SecondAuthActivateModalPropsType {
  onClose: () => void;
}

const SecondAuthActivateModal = ({
  onClose,
}: SecondAuthActivateModalPropsType) => {
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const setUserData = useSetRecoilState(userDataState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCancel = () => {
    handleClose();
  };

  window.onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);
    console.log("confirm");
    turnOn2Fa(code)
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        alert("인증번호가 일치하지 않습니다.");
        setCode("");
        setLoading(false);
      });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    for (let i = 0; i < newCode.length; i++) {
      if (newCode[i] < "0" || newCode[i] > "9") {
        return;
      }
    }
    if (newCode.length === 6) {
      handleSubmit();
    } else if (newCode.length < 6) {
      setCode(newCode);
    }
  };

  useEffect(() => {
    setLink("");
    generate2FaLink()
      .then((res) => {
        setLink(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          alert("이미 2차 인증이 활성화되어 있습니다.");
          handleClose();
        }
      });

    return () => {
      getUser()
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
  }, [handleClose, setUserData]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  return (
    <S.ModalBlind onClick={handleCancel}>
      <S.ModalContainer onSubmit={handleSubmit}>
        <S.Title>2차인증 활성화</S.Title>
        {loading ? (
          <img src={Loading} alt="loading" />
        ) : (
          <QRCodeCanvas value={link} size={150} bgColor={"#494D5F"} />
        )}
        <S.Input
          ref={inputRef}
          value={code}
          onChange={handleCodeChange}
          disabled={loading}
        />
        <IconButton title="취소" theme="LIGHT" onClick={handleCancel} />
      </S.ModalContainer>
    </S.ModalBlind>
  );
};

export default SecondAuthActivateModal;
