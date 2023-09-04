import ChannelInviteListItem, {
  ChannelInviteListItemPropsType,
} from "@components/channel/channelInviteListItem";
import { participantListState } from "@recoil/atoms/channel";
import { channelInviteModalState } from "@recoil/atoms/modal";
import { allUserListState } from "@recoil/atoms/common";
import { useEffect, useState } from "react";
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
      const userList = allUserList.filter(
        (user) =>
          !participantList.some(
            (participant) => participant.userId === user.id,
          ),
      );
      const inviteList = userList.map((user) => {
        const prevItem = prev.find((prevUser) => prevUser.user.id === user.id);
        return prevItem ?? { user: user, invited: false };
      });
      return inviteList;
    });
  }, [allUserList, participantList]);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  });

  const handleClose = () => {
    setChannelInviteModal(false);
  };

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
