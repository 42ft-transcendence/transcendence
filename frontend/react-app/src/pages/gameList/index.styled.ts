import { styled } from "styled-components";

export const GameRoomCardContainer = styled.div`
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
  overflow-y: auto;
`;

export const GameRoomCard = styled.div`
  width: 360px;
  height: 100px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border-radius: 20px;
  align-items: center;
  display: flex;
  margin-left: 30px;
  margin-bottom: 30px; /* 다음 줄로 넘어갈 때의 여백 */
  cursor: pointer;
`;

export const GameRoomCardLeft = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const GameRoomCardRight = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const GameRoomTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-famliy: inter;
  margin-left: 20px;
  margin-top: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomOption = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-famliy: inter;
  margin-left: 20px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomNumOfPeople = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  font-famliy: inter;
  justify-content: flex-end;
  margin-top: 30px;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomStatus = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  font-famliy: inter;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;
