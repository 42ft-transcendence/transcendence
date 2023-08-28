import Detective from "@assets/icons/Detective.svg";
import Hash from "@assets/icons/Hash.svg";
import LockKey from "@assets/icons/LockKey.svg";
import { ChannelType } from "@type";
import * as S from "./index.styled";

export interface ChannelListItemPropsType {
  channel: ChannelType;
  onClick: (channel: ChannelType) => void;
  hasNewMessage?: boolean;
}

const ChannelIcons = {
  PUBLIC: Hash,
  PROTECTED: LockKey,
  PRIVATE: Detective,
};

const ChannelListItem = ({
  channel,
  onClick,
  hasNewMessage,
}: ChannelListItemPropsType) => {
  return (
    <S.Container onClick={() => onClick(channel)}>
      <S.ChannelIcon src={ChannelIcons[channel.type]} alt={channel.type} />
      <S.Title>{channel.name}</S.Title>
      <S.Participants>{channel.participants?.length}</S.Participants>
      {hasNewMessage && <S.NewMessage />}
    </S.Container>
  );
};

export default ChannelListItem;
