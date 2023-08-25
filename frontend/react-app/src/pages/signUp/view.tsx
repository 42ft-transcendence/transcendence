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

interface TextButtonProps {
  title: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

const TextButton = ({ title, onClick, theme }: TextButtonProps) => (
  <S.TextButton mode={theme} onClick={onClick}>
    {title}
  </S.TextButton>
);

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
      {/*
        <DuplicatedNicknameText $validated={validateNickname}>
          {validateMessage}
        </DuplicatedNicknameText>
        <SignUpButtonContainer>
          <IconButton title="취소" onClick={onCancel} theme="DARK" />
          <IconButton title="확인" onClick={onConfirm} theme="DARK" />
        </SignUpButtonContainer> */}
    </LoginContainer>
    // <div style={{ width: "100%", height: "100%", display: "flex" }}>
    //   <NavBarContainer />
    //   <SideBarContainer>
    //     <h1
    //       style={{
    //         color: "#E5EAF5",
    //         fontSize: "32px",
    //         fontWeight: "Bold",
    //         fontFamily: "roboto",
    //       }}
    //     >
    //       회원가입
    //     </h1>
    //   </SideBarContainer>
    //   <ContentContainer>
    //     <ProfileImageContainer>
    //       <label htmlFor="imageInput">
    //         <ProfileImage src={selectedImage} alt="profile image" />
    //         <PencilIcon />
    //       </label>
    //       <input
    //         id="imageInput"
    //         type="file"
    //         name="file"
    //         ref={fileInputRef}
    //         style={{ display: "none" }}
    //         onChange={onImageChange}
    //         accept="image/*" // 이미지 파일만 선택 가능
    //       />
    //     </ProfileImageContainer>
    //     <TextButton
    //       title="기본 이미지"
    //       theme="DARK"
    //       onClick={onDefaultProfile}
    //     />
    //     <InputBox onChange={onNicknameChange} onKeyPress={onConfirm} />
    //     <DuplicatedNicknameText $validated={validateNickname}>
    //       {validateMessage}
    //     </DuplicatedNicknameText>
    //     <SignUpButtonContainer>
    //       <IconButton title="취소" onClick={onCancel} theme="DARK" />
    //       <IconButton title="확인" onClick={onConfirm} theme="DARK" />
    //     </SignUpButtonContainer>
    //   </ContentContainer>
    // </div>
  );
};

export default SignUpPageView;
