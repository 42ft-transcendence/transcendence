import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "@api";

export interface UploadAvatarResponse {
  originalname: string;
  filename: string;
  imageURL: string;
}

/**
 * 유저 프로필 이미지 저장 요청
 * @url /file/fileUpload
 * @method POST
 * @param avatar 이미지 파일
 * @returns 원본 이름, 저장된 이름, URL 반환
 */
export const uploadAvatar = async (
  file: FormData,
): Promise<AxiosResponse<UploadAvatarResponse>> => {
  const response = await axios.post(`${base_url}/file/fileUpload`, file, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
      contentType: "multipart/form-data",
    },
  });
  return response;
};

/**
 * 유저 프로필 이미지 삭제 요청
 * @url /file/deleteImage
 * @method DELETE
 * @returns void response
 */
export const deleteAvatar = async (): Promise<AxiosResponse<void>> => {
  const response = await axios.delete(`${base_url}/file/deleteImage`, {
    headers: {
      Authorization: `Bearer ${cookies.load("jwt") as string}`,
    },
  });
  return response;
};
