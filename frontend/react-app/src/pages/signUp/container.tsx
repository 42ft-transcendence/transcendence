import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import SignUpPageView from "./view";
import React, { useState, useRef, useEffect } from "react";
import {
  uploadAvatar,
  setAvatarPath,
  setNickname,
  checkNickname,
  deleteAvatar,
  UploadAvatarResponse,
} from "@api";
import * as cookies from "react-cookies";
import { userDataState } from "@recoil/atoms/common";
import { UserType } from "@src/types";
import { AxiosResponse } from "axios";
import { useProfileActions } from "@src/hooks/useProfileActions";
import { chatSocket } from "@src/router/socket/chatSocket";

const SignUpPageContainer = () => {
  const [userData, setUserData] = useRecoilState<UserType>(userDataState);
  const [validateMessage, setValidateMessage] = useState(""); // 닉네임 중복 여부 메시지
  const [validateNickname, setValidateNickname] = useState("true"); // 닉네임 중복 여부
  const { deleteImage, handleDefaultProfile, handleImageChange } =
    useProfileActions(setUserData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  let unhandledClose = true;

  const handleCancel = async () => {
    console.log("회원 가입 취소");
    await deleteImage();
    cookies.remove("jwt", { path: "/" });
    navigate("/");
  };

  const uploadNickName = async () => {
    const nicknameElement = document.getElementById("nickname");
    const nickname = nicknameElement?.value as string;
    setUserData((data: UserType) => ({
      ...data,
      nickname: nickname,
    }));

    try {
      const checkNicknameResponse = await checkNickname(userData.nickname);
      if (checkNicknameResponse.data.status === 400) {
        return checkNicknameResponse;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await setNickname(nickname);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.status !== 201) {
        throw response;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setUserData(response.data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValidateNickname("false");
      void error;
    }
  };

  const handleConfirm = () => {
    uploadNickName()
      .then((response) => {
        if (response?.data.status === 400) {
          throw response;
        }
        unhandledClose = false;
        console.log("회원 가입 완료");
        navigate("/");
      })
      .catch((error) => {
        setValidateNickname("false");
        setValidateMessage(error.data.message);
        console.error("error: ", error);
      });
  };

  const handleNicknameChange = (value: string) => {
    setUserData((data: UserType) => ({
      ...data,
      nickname: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await checkNickname(userData.nickname);
        if (response.data.status === 200) {
          setValidateNickname("true");
          setValidateMessage("사용 가능한 닉네임입니다.");
        } else {
          setValidateNickname("false");
          userData.nickname === ""
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
  }, [userData.nickname]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    if (unhandledClose) {
      cookies.remove("jwt", { path: "/" });
      chatSocket.disconnect();
    }
  };

  return (
    <SignUpPageView
      selectedImage={userData.avatarPath}
      validateNickname={validateNickname}
      validateMessage={validateMessage}
      onImageChange={(e) => {
        // eslint를 위한 변경
        // Promise-returning function provided to attribute where a void return was expected.eslint@typescript-eslint/no-misused-promises
        handleImageChange(e).catch((error) => {
          // 에러 처리
          console.error("Error in handleImageChange: ", error);
        });
      }}
      // onDefaultProfile={handleDefaultProfile}
      onDefaultProfile={() => {
        // eslint를 위한 변경
        // Promise-returning function provided to attribute where a void return was expected.eslint@typescript-eslint/no-misused-promises
        handleDefaultProfile().catch((error) => {
          // 에러 처리
          console.error("Error in handleDefaultProfile: ", error);
        });
      }}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onNicknameChange={handleNicknameChange}
      fileInputRef={fileInputRef}
    />
  );
};

export default SignUpPageContainer;
