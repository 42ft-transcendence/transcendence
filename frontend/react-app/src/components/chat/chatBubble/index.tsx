import * as S from "./index.styled";

export interface ChatBubblePropsType {
  message: string;
  isMine: boolean;
}

const ChatBubble = ({ message, isMine }: ChatBubblePropsType) => {
  if (isMine) {
    return (
      <S.Container isMine={isMine}>
        <S.Message isMine={isMine}>{message}</S.Message>
      </S.Container>
    );
  }
  return (
    <S.Container isMine={isMine}>
      <S.Message isMine={isMine}>{message}</S.Message>
    </S.Container>
  );
};

export default ChatBubble;
