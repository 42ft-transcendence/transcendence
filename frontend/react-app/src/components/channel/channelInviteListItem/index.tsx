import { UserType } from "@src/types";
import * as S from "./index.styled";
import { chatSocket } from "@router/socket/chatSocket";
import { useRecoilValue } from "recoil";
import { channelState } from "@src/recoil/atoms/channel";
import { useCallback } from "react";

export interface ChannelInviteListItemPropsType {
  user: UserType;
  invited: boolean;
}

const ChannelInviteListItem = ({
  user,
  invited,
}: ChannelInviteListItemPropsType) => {
  const channel = useRecoilValue(channelState);

  const handleClick = useCallback(() => {
    if (!invited && channel) {
      chatSocket.emit("send_invite", { userId: user.id, channel: channel.id });
    }
  }, [channel, invited, user]);

  return (
    <S.Container onClick={handleClick} $invited={invited}>
      <S.Profile src={user.avatarPath} alt={user.nickname} />
      <S.Status $status={user.status} />
      <S.Title>{user.nickname}</S.Title>
    </S.Container>
  );
};

export default ChannelInviteListItem;
