import { ChannelType } from "@src/types";
import * as S from "./index.styled";

export interface ChannelSearchItemPropsType {
  channel: ChannelType;
  onClick: (channel: ChannelType) => void;
}

const ChannelDescription = {
  PUBLIC: "공개 채널",
  PROTECTED: "비밀 채널",
  PRIVATE: "비공개 채널",
};

const ChannelSearchItem = ({
  channel,
  onClick,
}: ChannelSearchItemPropsType) => {
  return (
    <S.Container onClick={() => onClick(channel)}>
      <S.Title>{channel.name}</S.Title>
      <S.Status>
        <S.ChannelType type={channel.type}>
          {ChannelDescription[channel.type]}
        </S.ChannelType>
        <S.Participants>{channel.participants?.length}</S.Participants>
      </S.Status>
    </S.Container>
  );
};

export default ChannelSearchItem;
