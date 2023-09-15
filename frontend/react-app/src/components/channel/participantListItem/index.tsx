import { ParticipantType, RoleType, UserType } from "@src/types";
import * as S from "./index.styled";
import { ProfileModalOnClickHandler } from "@src/utils";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface ParticipantListItemPropsType {
  participant: ParticipantType;
}

const ParticipantListItem = ({ participant }: ParticipantListItemPropsType) => {
  const user = participant.user as UserType;
  const role = participant.owner
    ? "owner"
    : participant.admin
    ? "admin"
    : ("attendee" as RoleType);
  const setShowProfile = ProfileModalOnClickHandler(
    useSetRecoilState(showProfileState),
    true,
    user,
  );
  const self = useRecoilValue(userDataState);

  const handleClick = () => {
    setShowProfile();
  };

  const isMe = user.id === self.id;

  return (
    <S.Container onClick={handleClick}>
      <S.Profile src={user.avatarPath} alt={user.nickname} $role={role} />
      <S.Status $status={user.status} />
      <S.Title $isMe={isMe}>{user.nickname}</S.Title>
    </S.Container>
  );
};

export default ParticipantListItem;
