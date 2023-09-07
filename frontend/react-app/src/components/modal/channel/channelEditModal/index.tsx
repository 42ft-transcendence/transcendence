import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { IconButton } from "@components/buttons";
import { ChannelTypeType } from "@src/types/channel.type";
import { channelState } from "@recoil/atoms/channel";
import { chatSocket } from "@router/socket/chatSocket";

import * as S from "./index.styled";
import { channelEditModalState } from "@src/recoil/atoms/modal";

const channelTypeText: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: "공개",
  [ChannelTypeType.PROTECTED]: "비밀",
  [ChannelTypeType.PRIVATE]: "비공개",
};

const ChannelEditModal = () => {
  ChannelTypeType.PUBLIC;
  const channel = useRecoilValue(channelState);
  const [name, setName] = useState<string>(channel ? channel.name : "");
  const [type, setType] = useState<ChannelTypeType>(
    channel ? channel.type : ChannelTypeType.PUBLIC,
  );
  const [password, setPassword] = useState<string>("");
  const [isOpened, setIsOpened] = useRecoilState(channelEditModalState);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (name === "") {
      alert("채널 이름을 입력해주세요.");
      return;
    }
    chatSocket.emit(
      "edit_channel",
      {
        channelId: channel?.id,
        channelName: name,
        type,
        password,
      },
      () => {
        handleClose();
      },
    );
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handleClose();
    } else if (event.key === "Enter") {
      handleSubmit();
    }
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTypeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    switch (type) {
      case ChannelTypeType.PUBLIC:
        setType(ChannelTypeType.PROTECTED);
        break;
      case ChannelTypeType.PROTECTED:
        setType(ChannelTypeType.PRIVATE);
        break;
      default:
        setType(ChannelTypeType.PUBLIC);
        break;
    }
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  if (isOpened === false) {
    return null;
  }
  return (
    <>
      <S.ModalOverlay onClick={handleClose} />
      <S.Container>
        <S.Form>
          <S.NameInput
            value={name}
            onChange={handleNameChange}
            placeholder="채널"
          />

          <S.Option>
            <S.OptionLabel>채널 유형</S.OptionLabel>
            <S.OptionContent>
              <S.TypeButton
                type="button"
                onClick={handleTypeToggle}
                $type={type}
              >
                {channelTypeText[type]}
              </S.TypeButton>
            </S.OptionContent>
          </S.Option>

          <S.Option>
            <S.OptionLabel>비밀번호</S.OptionLabel>
            <S.OptionContent>
              <S.PasswordInput
                disabled={type !== ChannelTypeType.PROTECTED}
                placeholder="비밀번호"
                value={password}
                onChange={onPasswordChange}
              />
            </S.OptionContent>
          </S.Option>

          <S.ButtonContainer>
            <IconButton title="취소" onClick={handleClose} theme="LIGHT" />
            <IconButton title="저장" onClick={handleSubmit} theme="LIGHT" />
          </S.ButtonContainer>
        </S.Form>
      </S.Container>
    </>
  );
};

export default ChannelEditModal;
