import { useRecoilValue } from "recoil";
import * as S from "./index.styled";
import { useEffect, useState } from "react";
import { participantListState } from "@src/recoil/atoms/channel";
import { userDataState } from "@src/recoil/atoms/common";

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
  const [muted, setMuted] = useState<boolean>(false);
  const userData = useRecoilValue(userDataState);
  const participantList = useRecoilValue(participantListState);

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

  useEffect(() => {
    const myInfo = participantList.find(
      (participant) => participant.user?.id === userData.id,
    );
    if (myInfo?.muted) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  }, [participantList, userData]);

  return (
    <S.Container>
      <S.InviteButton onClick={handleGameClick} $isChannel={isChannel} />
      <S.Form onSubmit={sendMessage}>
        <S.Input
          value={muted ? "관리자에 의해 채팅이 금지되었습니다." : value}
          onChange={handleInputChange}
          disabled={muted}
        />
        <S.SendButton type="submit" disabled={muted} />
      </S.Form>
    </S.Container>
  );
};

export default ChatInput;
