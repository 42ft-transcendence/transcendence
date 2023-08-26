import Modal from "react-modal";
import {
  SettingOptionModalButton,
  SettingOptionModalContentWrapper,
  SettingOptionModalDivider,
} from "../../navBar/index.styled";
import {
  ChangeProfileImageModalContent,
  ChangeProfileImageModalOverlay,
} from "./index.styled";

interface ChangeProfileImageModalProps {
  changeImage: boolean;
  setChangeImage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChangeProfileImageModal = (
  props: ChangeProfileImageModalProps,
) => {
  return (
    <Modal
      isOpen={props.changeImage}
      onRequestClose={() => props.setChangeImage(false)}
      style={{
        content: { ...ChangeProfileImageModalContent },
        overlay: { ...ChangeProfileImageModalOverlay },
      }}
    >
      <SettingOptionModalContentWrapper>
        <SettingOptionModalButton
          title="기본 이미지로 변경"
          onClick={() => console.log("기본 이미지로 변경")}
        >
          기본 이미지로 변경
        </SettingOptionModalButton>
        <SettingOptionModalDivider />
        <SettingOptionModalButton
          title="이미지 파일 선택"
          onClick={() => console.log("이미지 파일 선택")}
        >
          이미지 파일 선택
        </SettingOptionModalButton>
      </SettingOptionModalContentWrapper>
    </Modal>
  );
};
