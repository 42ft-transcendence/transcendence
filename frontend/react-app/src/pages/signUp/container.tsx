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

const SignUpPageContainer = () => {
  const [userData, setUserData] = useRecoilState<UserType>(userDataState);
  const [selectedImage, setSelectedImage] = useState<string>(
    userData.avatarPath,
  );
  const [validateMessage, setValidateMessage] = useState(""); // 닉네임 중복 여부 메시지
  const [validateNickname, setValidateNickname] = useState("true"); // 닉네임 중복 여부
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  let unhandledClose = true;

  const deleteImage = async () => {
    try {
      const deleteResponse = await deleteAvatar();
      if (deleteResponse.status === 200) {
        console.log("deleteResponse: ", deleteResponse);
        console.log("기존 이미지 삭제 성공");
      }
    } catch (deleteError) {
      console.log("기존 이미지 삭제 실패");
    }
  };

  const saveAvatarPath = async (imageURL: string) => {
    await setAvatarPath(imageURL).then(() => {
      // 업로드한 이미지 경로 저장
      setUserData((data: UserType) => ({
        // 유저 데이터 업데이트
        ...data,
        avatarPath: imageURL,
      }));
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formData = new FormData(); // FormData 생성
        formData.append("file", file); // file이라는 이름으로 파일 추가
        // 현재 업로드한 이미지 삭제 (백엔드에서 기본 이미지는 삭제하지 않음)
        await deleteImage();
        setSelectedImage(URL.createObjectURL(file)); // 선택한 이미지 미리보기
        const response: AxiosResponse<UploadAvatarResponse> =
          await uploadAvatar(formData); // 이미지 업로드
        if (response.status === 201) {
          // 업로드 성공
          await saveAvatarPath(response.data.imageURL); // 업로드한 이미지 경로 저장
        } else throw response; // 업로드 실패
      }
    } catch (error) {
      console.log("handleImageChange error: ", error);
    }
  };

  const handleDefaultProfile = async () => {
    const randomPath = `http://localhost/files/profiles/profile${Math.floor(
      Math.random() * 4,
    )}.svg`;
    await deleteImage();
    await saveAvatarPath(randomPath);
    setSelectedImage(randomPath);
  };

  const handleCancel = async () => {
    console.log("회원 가입 취소");
    await deleteImage();
    cookies.remove("jwt", { path: "/" });
    // disconnectSocket();
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
      // disconnectSocket();
    }
  };

  return (
    <SignUpPageView
      selectedImage={selectedImage}
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
