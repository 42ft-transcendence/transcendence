import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { ChannelType } from "@src/types";
import { IconButton } from "@components/buttons";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { chatSocket } from "@router/socket/chatSocket";

import * as S from "./index.styled";

export interface ChannelJoinModalPropsType {
  isOpen: boolean;
  channel: ChannelType;
  onClose: () => void;
}

const ChannelJoinModal = ({
  isOpen,
  channel,
  onClose,
}: ChannelJoinModalPropsType) => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleJoin = () => {
    chatSocket.emit(
      "join_room",
      { roomId: channel.id, password: password },
      (joined_channel: ChannelType) => {
        setJoinedChannelList((prev) => [
          ...prev,
          {
            ...joined_channel,
            hasNewMessages: false,
          },
        ]);
        navigate(`/channel/${joined_channel.id}`);
      },
    );
  };

  const handleCancel = () => {
    onClose();
  };

  if (isOpen === false) {
    return null;
  }
  return (
    <>
      <S.Overlay onClick={handleCancel} />
      <S.Container>
        <S.Title>{channel.name}에 참여하시겠습니까?</S.Title>
        {channel.type === "PROTECTED" && (
          <S.PasswordInput
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
          />
        )}
        <S.ButtonContainer>
          <IconButton title="취소" theme="LIGHT" onClick={handleCancel} />
          <IconButton title="참여" theme="LIGHT" onClick={handleJoin} />
        </S.ButtonContainer>
      </S.Container>
    </>
  );
};

export default ChannelJoinModal;
