// import {
//   ContentContainer,
//   NavBarContainer,
//   SideBarContainer,
//   SignUpButtonContainer,
// } from "../../component/containers/index.styled";
import {
  DuplicatedNicknameText,
  ProfileImage,
  ProfileImageContainer,
  PencilIcon,
} from "./index.styled";
import * as S from "./index.styled";
// import { IconButton, TextButton } from "../../component/Buttons";
// import InputBox from "../../component/InputBox";

import { LoginContainer } from "../login/index.styled";
import InputBox from "@src/components/inputBox";
import { IconButton, TextButton } from "@src/components/buttons";

export interface SignUpPageViewProps {
  selectedImage: string;
  validateNickname: string;
  validateMessage: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDefaultProfile: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onNicknameChange: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const SignUpPageView = ({
  selectedImage,
  validateNickname,
  validateMessage,
  onImageChange,
  onDefaultProfile,
  onCancel,
  onConfirm,
  onNicknameChange,
  fileInputRef,
}: SignUpPageViewProps) => {
  return (
    <LoginContainer>
      <S.SignUpTitle>회원가입</S.SignUpTitle>
      <ProfileImageContainer>
        <label htmlFor="imageInput">
          <ProfileImage src={selectedImage} alt="profile image" />
          <PencilIcon />
        </label>
        <input
          id="imageInput"
          type="file"
          name="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onImageChange}
          accept="image/*" // 이미지 파일만 선택 가능
        />
      </ProfileImageContainer>
      <TextButton
        title="기본 이미지"
        theme="LIGHT"
        onClick={onDefaultProfile}
      />
      <InputBox onChange={onNicknameChange} onKeyPress={onConfirm} />
      <DuplicatedNicknameText $validated={validateNickname}>
        {validateMessage}
      </DuplicatedNicknameText>
      <S.SignUpButtonContainer>
        <IconButton title="취소" onClick={onCancel} theme="LIGHT" />
        <IconButton title="확인" onClick={onConfirm} theme="LIGHT" />
      </S.SignUpButtonContainer>
    </LoginContainer>
  );
};

export default SignUpPageView;
