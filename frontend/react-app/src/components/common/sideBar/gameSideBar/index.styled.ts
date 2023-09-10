import { styled } from "styled-components";

export const roomNameBox = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const RoomInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colors.freezePurple};
`;
