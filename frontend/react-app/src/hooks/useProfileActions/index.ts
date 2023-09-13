import { Dispatch, SetStateAction } from "react";
import {
  UploadAvatarResponse,
  deleteAvatar,
  setAvatarPath,
  uploadAvatar,
} from "@src/api";
import { UserType } from "@src/types";
import { AxiosResponse } from "axios";

export const useProfileActions = (
  setUserData: Dispatch<SetStateAction<UserType>>,
) => {
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

  const handleDefaultProfile = async () => {
    const randomPath = `${
      process.env.VITE_BASE_URL
    }/files/profiles/profile${Math.floor(Math.random() * 5)}.png`;
    await deleteImage();
    await saveAvatarPath(randomPath);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formData = new FormData(); // FormData 생성
        formData.append("file", file); // file이라는 이름으로 파일 추가
        // 현재 업로드한 이미지 삭제 (백엔드에서 기본 이미지는 삭제하지 않음)
        await deleteImage();
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

  return { deleteImage, handleDefaultProfile, handleImageChange };
};
