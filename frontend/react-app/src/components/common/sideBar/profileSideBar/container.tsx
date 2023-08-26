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
import { deleteAvatar, setAvatarPath } from "@src/api";
import { UserType } from "@src/types";

interface ChangeProfileImageModalProps {
  changeImage: boolean;
  setChangeImage: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
}

export const ChangeProfileImageModal = (
  props: ChangeProfileImageModalProps,
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
      props.setUserData((data: UserType) => ({
        // 유저 데이터 업데이트
        ...data,
        avatarPath: imageURL,
      }));
    });
  };

  const handleDefaultProfile = async () => {
    const randomPath = `http://localhost/files/profiles/profile${Math.floor(
      Math.random() * 4,
    )}.svg`;
    await deleteImage();
    await saveAvatarPath(randomPath);
    // setSelectedImage(randomPath);
  };

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
          onClick={() => handleDefaultProfile()}
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
