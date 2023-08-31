import * as S from "./index.styled";
import { useState } from "react";

export interface ChatInputPropsType {
  onSendMessage?: (message: string) => void;
  onInvite: () => void;
  isChannel: boolean;
}

const ChatInput = ({
  onSendMessage,
  onInvite,
  isChannel,
}: ChatInputPropsType) => {
  const [value, setValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim().length === 0) return;
    // TODO: send message
    if (onSendMessage) {
      onSendMessage(value);
    } else {
      alert(`message: ${value}`);
    }
    setValue("");
  };

  const handleGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO: send game message
    onInvite();
  };
  return (
    <S.Container>
      <S.InviteButton onClick={handleGameClick} $isChannel={isChannel} />
      <S.Form onSubmit={sendMessage}>
        <S.Input value={value} onChange={handleInputChange} />
        <S.SendButton type="submit" />
      </S.Form>
    </S.Container>
  );
};

export default ChatInput;
