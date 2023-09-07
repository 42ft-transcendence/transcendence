import styled from "styled-components";

export const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameProfileContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.gold};
`;

export const GameChattingContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bronze};
`;

export const GameMatchBox = styled.div<{ $isReady: boolean }>`
  position: relative; // 추가된 코드
  width: 300px;
  height: 400px;
  display: flex;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  border: 4px solid
    ${(props) =>
      props.$isReady
        ? props.theme.colors.gaming
        : props.theme.colors.heavyPurple};
`;

export const GameWaitingBox = styled.div`
  position: relative; // 추가된 코드
  width: 300px;
  height: 400px;
  display: flex;
  color: ${(props) => props.theme.colors.freezePurple};
  background-color: ${(props) => props.theme.colors.heavyPurple};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 4px solid ${(props) => props.theme.colors.heavyPurple};
`;

export const ReadyIcon = styled.img`
  position: absolute; // 추가된 코드
  top: 0; // 추가된 코드
  right: 0; // 추가된 코드
  width: 157px;
  height: 88px;
  transform: translate(
    50%,
    -50%
  ); // 아이콘의 중심이 우측 상단에 위치하도록 조정
`;

export const VsIcon = styled.div`
  width: 30px;
  height: 30px;
  font-size: 30px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const gameRoomProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-top: 30px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const UserCardStatus = styled.div<{ $status: number }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-left: 15px;
  margin-top: 50px;
  background-color: ${(props) => {
    return props.$status === 0
      ? props.theme.colors.online
      : props.$status === 1
      ? props.theme.colors.gaming
      : props.theme.colors.offline;
  }};
`;

export const gameRoomProfileNickname = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.freezePurple};
  margin: 20px;
  cursor: pointer;
`;

export const gameRoomProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
  gap: 10px;
`;

export const gameRoomProfileRankImg = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const gameRoomProfileRank = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
  margin-left: 30px;
  cursor: pointer;
`;

export const GameChattingBox = styled.div`
  width: 100%;
  height: 25px;
  display; flex;
  align-items: center;
  color: ${(props) => props.theme.colors.freezePurple};
`;
