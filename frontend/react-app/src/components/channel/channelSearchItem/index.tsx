import { ChannelType } from "@src/types";
import * as S from "./index.styled";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { channelJoinModalState } from "@src/recoil/atoms/modal";
import { joinedChannelListState } from "@src/recoil/atoms/channel";
import { useNavigate } from "react-router-dom";

export interface ChannelSearchItemPropsType {
  channel: ChannelType;
}

const ChannelDescription = {
  PUBLIC: "공개 채널",
  PROTECTED: "비밀 채널",
  PRIVATE: "비공개 채널",
};

const ChannelSearchItem = ({ channel }: ChannelSearchItemPropsType) => {
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
      <S.Title>{channel.name}</S.Title>
      <S.Status>
        <S.ChannelType $type={channel.type}>
          {ChannelDescription[channel.type]}
        </S.ChannelType>
        <S.Participants>{channel.participants?.length}</S.Participants>
      </S.Status>
    </S.Container>
  );
};

export default ChannelSearchItem;
