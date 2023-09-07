import ChannelInviteListItem, {
  ChannelInviteListItemPropsType,
} from "@components/channel/channelInviteListItem";
import { participantListState } from "@recoil/atoms/channel";
import { channelInviteModalState } from "@recoil/atoms/modal";
import { allUserListState } from "@recoil/atoms/common";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import * as S from "./index.styled";

const ChannelInviteModal = () => {
  const participantList = useRecoilValue(participantListState);
  const allUserList = useRecoilValue(allUserListState);
  const [inviteList, setInviteList] = useState<
    ChannelInviteListItemPropsType[]
  >([]);
  const setChannelInviteModal = useSetRecoilState(channelInviteModalState);

  useEffect(() => {
    setInviteList((prev) => {
      return allUserList.map((user) => {
        const prevItem = prev.find((prevUser) => prevUser.user.id === user.id);
        if (prevItem) return prevItem;
        else if (
          participantList.some(
            (participant) => participant.user?.id === user.id,
          )
        )
          return { user, invited: true };
        else return { user, invited: false };
      });
    });
  }, [setInviteList, allUserList, participantList]);

  const handleClose = useCallback(() => {
    setChannelInviteModal(false);
  }, [setChannelInviteModal]);

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

  return (
    <>
      <S.Overlay onClick={handleClose} />
      <S.Container>
        <S.Title>채널로 초대하기</S.Title>
        <S.List>
          {inviteList.map((item) => (
            <ChannelInviteListItem
              key={item.user.id}
              user={item.user}
              invited={item.invited}
            />
          ))}
        </S.List>
      </S.Container>
    </>
  );
};

export default ChannelInviteModal;
