import { useMatch } from "react-router-dom";
import * as S from "./index.styled";
import { useRecoilValue } from "recoil";
import { channelState } from "@src/recoil/atoms/channel";
import { dmUserState } from "@src/recoil/selectors/directMessage";
import { useMemo } from "react";
import { ChannelTypeType } from "@src/types";
import Public from "@assets/icons/HashDark.svg";
import Private from "@assets/icons/DetectiveDark.svg";
import Protected from "@assets/icons/LockKeyDark.svg";

const TopBar = () => {
  const isChannel = useMatch("/channel/:channelId");
  const channel = useRecoilValue(channelState);
  const dmUser = useRecoilValue(dmUserState);

  const image = useMemo(() => {
    if (isChannel) {
      switch (channel?.type) {
        case ChannelTypeType.PUBLIC:
          return Public;
        case ChannelTypeType.PRIVATE:
          return Private;
        case ChannelTypeType.PROTECTED:
          return Protected;
        default:
          return Public;
      }
    } else {
      return (
        dmUser?.avatarPath ?? `${process.env.BASE_URL}/profiles/profile0.png`
      );
    }
  }, [channel?.type, dmUser?.avatarPath, isChannel]);

  const title = useMemo(() => {
    if (isChannel) {
      return channel?.name ?? "";
    } else {
      return dmUser?.nickname ?? "";
    }
  }, [channel?.name, dmUser?.nickname, isChannel]);

  return (
    <S.Container>
      <S.Icon src={image} alt={title} />
      <S.Title>{title}</S.Title>
      {isChannel && (
        <S.Participants>{channel?.participants?.length}</S.Participants>
      )}
    </S.Container>
  );
};

export default TopBar;
