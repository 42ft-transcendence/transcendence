import { styled } from "styled-components";
import TailMine from "@assets/images/chat-bubble-tail-mine.svg";
import TailOther from "@assets/images/chat-bubble-tail-other.svg";

export const Container = styled.div<{ $isMine: boolean }>`
  display: flex;
  width: max-content;
  height: min-content;
  justify-content: start;
  margin-block: 5px;
  filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.25));

  ${({ $isMine }) =>
    $isMine
      ? `
    &:after {
      content: "";
      width: 20px;
      height: 25px;
      background-image: url(${TailMine});
      background-repeat: no-repeat;
      display: inline-block;
      vertical-align: baseline;
    }
  `
      : `
    &:before {
      content: "";
      width: 20px;
      height: 25px;
      background-image: url(${TailOther});
      background-repeat: no-repeat;
      background-size: contain;
      display: inline-block;
      vertical-align: baseline;
    }
  `}
`;

export const Message = styled.span<{ $isMine: boolean }>`
  display: flex;
  background-color: ${({ $isMine, theme }) =>
    $isMine ? theme.colors.myChat : theme.colors.floating};
  border-radius: 5px;
  padding: 5px 10px;
  color: black;
  max-width: 300px; // TODO: make this dynamic
  height: fit-content;
  word-break: break-all;
`;
