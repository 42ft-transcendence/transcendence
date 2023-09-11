import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { ChannelType, ChannelTypeType } from "@src/types";
import { IconButton } from "@components/buttons";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { chatSocket } from "@src/utils/sockets/chatSocket";

import * as S from "./index.styled";
import { channelJoinModalState } from "@src/recoil/atoms/modal";

const ChannelJoinModal = () => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const [channel, setChannel] = useRecoilState(channelJoinModalState);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClose = useCallback(() => {
    setChannel(null);
  }, [setChannel]);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    });
    return () => {
      window.removeEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          handleClose();
        }
      });
    };
  }, [handleClose]);

  const handleJoin = () => {
    chatSocket.emit(
      "join_channel",
      { channelId: channel?.id, password: password },
      (joined_channel: ChannelType) => {
        setJoinedChannelList((prev) =>
          prev.some((prevChannel) => prevChannel.id === joined_channel.id)
            ? prev
            : [
                ...prev,
                {
                  ...joined_channel,
                  hasNewMessages: false,
                },
              ],
        );
        handleClose();
        navigate(`/channel/${joined_channel.id}`);
      },
    );
  };

  if (channel === null) {
    return null;
  }
  return (
    <>
      <S.Overlay onClick={handleClose} />
      <S.Container>
        <S.Title>{channel.name}에 참여하시겠습니까?</S.Title>
        {channel.type === ChannelTypeType.PROTECTED && (
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

export default ChannelJoinModal;
