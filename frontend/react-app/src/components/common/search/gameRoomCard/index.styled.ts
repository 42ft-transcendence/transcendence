import { styled } from "styled-components";

export const GameRoomCardContainer = styled.div`
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
  overflow-y: auto;
`;

export const GameRoomCard = styled.div<{ $status: string }>`
  width: 360px;
  height: 100px;
  background-color: ${(props) => {
    const heavyPurple = props.theme.colors.heavyPurple;
    if (props.$status !== "대기중") {
      const r = parseInt(heavyPurple.slice(1, 3), 16);
      const g = parseInt(heavyPurple.slice(3, 5), 16);
      const b = parseInt(heavyPurple.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }
    return heavyPurple; // 'PUBLIC'일 때의 색상값
  }};
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

export const GameRoomCardRightTop = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const GameRoomCardProtectedIcon = styled.img`
  width: 20px;
  height: 20px;
  display: flex;
  margin-top: 30px;
  margin-left: 20px;
`;

export const GameRoomTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-family: inter;
  margin-left: 20px;
  margin-top: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomOption = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  margin-left: 20px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomNumOfPeople = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  // justify-content: flex-end;
  margin-top: 30px;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameRoomStatus = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.freezePurple};
`;
