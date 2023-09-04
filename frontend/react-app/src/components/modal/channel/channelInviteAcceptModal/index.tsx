import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { ChannelType, ChannelTypeType } from "@src/types";
import { IconButton } from "@components/buttons";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { chatSocket } from "@router/socket/chatSocket";

import * as S from "./index.styled";
import { channelInviteAcceptModalState } from "@src/recoil/atoms/modal";

const ChannelInviteAcceptModal = () => {
  const [invite, setInvite] = useRecoilState(channelInviteAcceptModalState);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClose = () => {
    setInvite(null);
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  });

  const handleJoin = () => {
    chatSocket.emit(
      "join_channel",
      { channelId: invite?.channel.id, password: password },
      (joined_channel: ChannelType) => {
        setJoinedChannelList((prev) => [
          ...prev,
          {
            ...joined_channel,
            hasNewMessages: false,
          },
        ]);
        handleClose();
        navigate(`/channel/${joined_channel.id}`);
      },
    );
  };

  return (
    <>
      <S.Overlay onClick={handleClose} />
      <S.Container>
        <S.Title>
          {invite?.user.nickname} 님께서 {invite?.channel.name}에
          초대하였습니다.
        </S.Title>
        {invite?.channel.type === ChannelTypeType.PROTECTED && (
          <S.PasswordInput
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
          />
        )}
        <S.ButtonContainer>
          <IconButton title="취소" theme="LIGHT" onClick={handleClose} />
          <IconButton title="참여" theme="LIGHT" onClick={handleJoin} />
        </S.ButtonContainer>
      </S.Container>
    </>
  );
};

export default ChannelInviteAcceptModal;
