import { UserType } from "@src/types";
import * as S from "./index.styled";

export interface DirectMessageListItemPropsType {
  user: UserType;
  onClick: (user: UserType) => void;
  hasNewMessage?: boolean;
}

const DirectMessageListItem = ({
  user,
  onClick,
  hasNewMessage,
}: DirectMessageListItemPropsType) => {
  return (
    <S.Container onClick={() => onClick(user)}>
      <S.Profile src={user.avatarPath} alt={user.nickname} />
      <S.Status status={user.status} />
      <S.Title>{user.nickname}</S.Title>
      {hasNewMessage && <S.NewMessage />}
    </S.Container>
  );
};

export default DirectMessageListItem;
