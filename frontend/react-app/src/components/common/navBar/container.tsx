import Modal from "react-modal";
import {
  SettingOptionModalButton,
  SettingOptionModalContent,
  SettingOptionModalContentWrapper,
  SettingOptionModalDivider,
  SettingOptionModalOverlay,
} from "./index.styled";
import { useRecoilState } from "recoil";
import { settingOptionModalState } from "@src/recoil/atoms/modal";
import { logout, resignUser } from "@src/api";
import { useNavigate } from "react-router-dom";
import { buttonHandler } from "@src/components/buttons";

Modal.setAppElement("#root");
export const SettingOptionModal = () => {
  const [settingOptionModalOpen, setSettingOptionModalOpen] =
    useRecoilState<boolean>(settingOptionModalState);
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={settingOptionModalOpen}
      onRequestClose={() => setSettingOptionModalOpen(false)}
      style={{
        content: { ...SettingOptionModalContent },
        overlay: { ...SettingOptionModalOverlay },
      }}
    >
      <SettingOptionModalContentWrapper>
        <SettingOptionModalButton
          title="로그아웃"
          onClick={() => buttonHandler({ todo: logout, navigate: navigate })}
        >
          로그아웃
        </SettingOptionModalButton>
        <SettingOptionModalDivider />
        <SettingOptionModalButton
          title="회원탈퇴"
          onClick={() =>
            buttonHandler({ todo: resignUser, navigate: navigate })
          }
        >
          회원탈퇴
        </SettingOptionModalButton>
      </SettingOptionModalContentWrapper>
    </Modal>
  );
};
