import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 1660px;
`;

export const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-auto-rows: 100px;
  grid-gap: 40px;
  width: 100%;
  padding-inline: 10%;
  flex-grow: 1;
  justify-content: center;
  align-items: flex-start;

  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.floating};
    border-radius: 4px;
  }
`;
