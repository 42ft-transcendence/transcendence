import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { IconButton } from "@components/buttons";
import { ChannelTypeType, ChannelType } from "@src/types/channel.type";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { chatSocket } from "@router/socket/chatSocket";

import * as S from "./index.styled";
import { channelCreateModalState } from "@src/recoil/atoms/modal";

const channelTypeText: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: "공개",
  [ChannelTypeType.PROTECTED]: "비밀",
  [ChannelTypeType.PRIVATE]: "비공개",
};

const ChannelCreateModal = () => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<ChannelTypeType>(ChannelTypeType.PUBLIC);
  const [password, setPassword] = useState<string>("");
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useRecoilState(channelCreateModalState);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit", name);
    event?.preventDefault();
    if (name === "") {
      alert("채널 이름을 입력해주세요.");
      return;
    }
    chatSocket.emit(
      "create_channel",
      { channelName: name, type, password },
      (channel_joined: ChannelType) => {
        setJoinedChannelList((prev) =>
          prev.some((prevChannel) => prevChannel.id === channel_joined.id)
            ? prev
            : [
                ...prev,
                {
                  ...channel_joined,
                  hasNewMessages: false,
                },
              ],
        );
        handleClose();
        navigate(`/channel/${channel_joined.id}`);
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
            placeholder="채널 이름"
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
            <IconButton title="생성" onClick={handleSubmit} theme="LIGHT" />
          </S.ButtonContainer>
        </S.Form>
      </S.Container>
    </>
  );
};

export default ChannelCreateModal;
