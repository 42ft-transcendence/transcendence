import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { IconButton } from "@components/buttons";
import { ChannelTypeType, ChannelType } from "@src/types/channel.type";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { chatSocket } from "@router/socket/chatSocket";

import * as S from "./index.styled";
import { channelCreateModalState } from "@src/recoil/atoms/modal";

const channelTypeText = {
  PUBLIC: "공개",
  PROTECTED: "비밀",
  PRIVATE: "비공개",
};

const ChannelCreateModal = () => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<ChannelTypeType>("PUBLIC");
  const [password, setPassword] = useState<string>("");
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useRecoilState(channelCreateModalState);

  const onSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    chatSocket.emit(
      "create_room",
      { roomName: name, type, password },
      (channel_joined: ChannelType) => {
        setJoinedChannelList((prev) => [
          ...prev,
          {
            ...channel_joined,
            hasNewMessages: false,
          },
        ]);
        handleClose();
        navigate(`/channel/${channel_joined.id}`);
      },
    );
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTypeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (type === "PUBLIC") {
      setType("PROTECTED");
    } else if (type === "PROTECTED") {
      setType("PRIVATE");
    } else {
      setType("PUBLIC");
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
      <S.ModalOverlay onClick={handleClose} onKeyDown={handleKeyDown} />
      <S.Container>
        <S.Form>
          <S.NameInput
            value={name}
            onChange={handleNameChange}
            placeholder="채널 이름"
          />

          <S.Option>
            <S.OptionLabel>채널 유형</S.OptionLabel>
            <S.OptionContent>
              <S.TypeButton onClick={handleTypeToggle} type={type}>
                {channelTypeText[type]}
              </S.TypeButton>
            </S.OptionContent>
          </S.Option>

          <S.Option>
            <S.OptionLabel>비밀번호</S.OptionLabel>
            <S.OptionContent>
              <S.PasswordInput
                disabled={type !== "PROTECTED"}
                placeholder="비밀번호"
                value={password}
                onChange={onPasswordChange}
              />
            </S.OptionContent>
          </S.Option>

          <S.ButtonContainer>
            <IconButton title="취소" onClick={handleClose} theme="LIGHT" />
            <IconButton title="생성" onClick={onSubmit} theme="LIGHT" />
          </S.ButtonContainer>
        </S.Form>
      </S.Container>
    </>
  );
};

export default ChannelCreateModal;
