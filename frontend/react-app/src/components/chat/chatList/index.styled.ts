import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChatList = styled.ul`
  width: 90%;
  flex-grow: 1;
  padding: 10px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.floating};
    border-radius: 4px;
  }
`;
