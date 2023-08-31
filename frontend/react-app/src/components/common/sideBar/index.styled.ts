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

export const boxWrapper = styled.div`
  display: flex;
  height: calc(100% - 100px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const TitleBox = styled.div`
  display: flex;
  width: 80%;
  height: 30px;
  align-items: center;
  justify-content: center;

  font-size: 26px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
  cursor: default;
`;

export const roomNameBox = styled.div`
  font-size: 30px;
  font-weight: bold;
  height: 50px;
  color: ${(props) => props.theme.colors.freezePurple};
`;
