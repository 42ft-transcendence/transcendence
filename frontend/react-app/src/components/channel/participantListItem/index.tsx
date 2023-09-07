import { ParticipantType, RoleType, UserType } from "@src/types";
import * as S from "./index.styled";
import { ProfileModalOnClickHandler } from "@src/utils";
import { showProfileState } from "@src/recoil/atoms/common";
import { useSetRecoilState } from "recoil";

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

  const handleClick = () => {
    setShowProfile();
  };

  return (
    <S.Container onClick={handleClick}>
      <S.Profile src={user.avatarPath} alt={user.nickname} $role={role} />
      <S.Status $status={user.status} />
      <S.Title>{user.nickname}</S.Title>
    </S.Container>
  );
};

export default ParticipantListItem;
