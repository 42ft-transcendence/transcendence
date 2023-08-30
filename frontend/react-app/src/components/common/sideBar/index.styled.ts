import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 250px;
  height: 100%;
  border: 0 1px 0 0 ${(props) => props.theme.colors.heavyPurple};
  background-color: ${(props) => props.theme.colors.heavyPurple};
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding-top: 20px;
  flex-shrink: 0;
`;

export const TitleBox = styled.div`
  display: flex;
  width: 80%;
  height: 30px;
  align-items: center;
  font-size: 26px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
  cursor: default;
`;
