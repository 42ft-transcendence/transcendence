import { UserType } from "@src/types";
import * as S from "./index.styled";
import { useNavigate } from "react-router-dom";

export interface DirectMessageListItemPropsType {
  user: UserType;
  hasNewMessage?: boolean;
}

const DirectMessageListItem = ({
  user,
  hasNewMessage,
}: DirectMessageListItemPropsType) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/direct-message/${user.id}`);
  };

  return (
    <S.Container onClick={handleClick}>
      <S.Profile src={user.avatarPath} alt={user.nickname} />
      <S.Status $status={user.status} />
      <S.Title>{user.nickname}</S.Title>
      {hasNewMessage && <S.NewMessage />}
    </S.Container>
  );
};

export default DirectMessageListItem;
