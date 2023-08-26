import Modal from "react-modal";
import {
  SettingOptionModalButton,
  SettingOptionModalContentWrapper,
  SettingOptionModalDivider,
} from "../../navBar/index.styled";
import { UserType } from "@src/types";
import { useProfileActions } from "@src/hooks/useProfileActions";
import * as S from "./index.styled";
import { useRef } from "react";

interface ChangeProfileImageModalProps {
  changeImage: boolean;
  setChangeImage: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
}

export const ChangeProfileImageModal = (
  props: ChangeProfileImageModalProps,
) => {
  const { handleDefaultProfile, handleImageChange } = useProfileActions(
    props.setUserData,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal
      isOpen={props.changeImage}
      onRequestClose={() => props.setChangeImage(false)}
      style={{
        content: { ...S.ModalContent },
        overlay: { ...S.ModalOverlay },
      }}
    >
      <SettingOptionModalContentWrapper>
        <SettingOptionModalButton
          title="기본 이미지로 변경"
          onClick={() =>
            handleDefaultProfile().then(() => props.setChangeImage(false))
          }
        >
          기본 이미지로 변경
        </SettingOptionModalButton>
        <SettingOptionModalDivider />
        <label htmlFor="imageInput">
          <SettingOptionModalButton
            title="이미지 파일 선택"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            이미지 파일 선택
          </SettingOptionModalButton>
        </label>
        <input
          id="imageInput"
          type="file"
          name="file"
          onChange={(e) =>
            handleImageChange(e).then(() => props.setChangeImage(false))
          }
          style={{ display: "none" }}
          accept="image/*" // 이미지 파일만 선택 가능
        />
      </SettingOptionModalContentWrapper>
    </Modal>
  );
};
