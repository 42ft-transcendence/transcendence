import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 250px;
  height: 100%;
  border: 0 1px 0 0 ${(props) => props.theme.colors.heavyPurple};
  background-color: ${(props) => props.theme.colors.heavyPurple};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
