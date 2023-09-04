import Detective from "@assets/icons/Detective.svg";
import Hash from "@assets/icons/Hash.svg";
import LockKey from "@assets/icons/LockKey.svg";
import { ChannelType, ChannelTypeType } from "@src/types";
import * as S from "./index.styled";
import { joinedChannelListState } from "@recoil/atoms/channel";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { channelJoinModalState } from "@src/recoil/atoms/modal";

export interface ChannelListItemPropsType {
  channel: ChannelType;
  hasNewMessage?: boolean;
}
const ChannelIcons: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: Hash,
  [ChannelTypeType.PRIVATE]: Detective,
  [ChannelTypeType.PROTECTED]: LockKey,
};
const ChannelIconAlt: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: "공개 채널",
  [ChannelTypeType.PRIVATE]: "비공개 채널",
  [ChannelTypeType.PROTECTED]: "비밀 채널",
};

const ChannelListItem = ({
  channel,
  hasNewMessage,
}: ChannelListItemPropsType) => {
  const joinedChannelList = useRecoilValue(joinedChannelListState);
  const setChannel = useSetRecoilState(channelJoinModalState);
  const navigate = useNavigate();

  const handleClick = () => {
    if (
      joinedChannelList.find((joinedChannel) => joinedChannel.id === channel.id)
    ) {
      navigate(`/channel/${channel.id}`);
    } else {
      setChannel(channel);
    }
  };

  return (
    <S.Container onClick={handleClick}>
      <S.ChannelIcon
        src={ChannelIcons[channel.type]}
        alt={ChannelIconAlt[channel.type]}
      />
      <S.Title>{channel.name}</S.Title>
      <S.Participants>{channel.participants?.length}</S.Participants>
      {hasNewMessage && <S.NewMessage />}
    </S.Container>
  );
};

export default ChannelListItem;
