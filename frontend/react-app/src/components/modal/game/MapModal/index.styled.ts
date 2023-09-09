import { styled } from "styled-components";

export const MapsWrapper = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  align-items: center;
  flex-direction: column;
  display: flex;
  z-index: 400;
  background-color: rgba(0, 0, 0, 1);
  gap: 10px;
  overflow: y-scroll;
`;

export const MapsContainer = styled.div`
  width: 820px;
  height: 620px;
  position: relative;
  display: flex;
  border: 10px solid ${(props) => props.theme.colors.freezePurple};
  background-color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameInfoContainer = styled.div`
  width: 820px;
  height: 170px;
  display: flex;
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 20px solid ${(props) => props.theme.colors.freezePurple};
  background-color: ${(props) => props.theme.colors.freezePurple};
`;

export const GameInfoPlayer = styled.div`
  width: 40%;
  height: 150px;
  display: flex;
  flex-direction: row;
`;

export const GameInfoPlayerImage = styled.img`
  width: 150px;
  height: 150px;
  border: 1px solid ${(props) => props.theme.colors.heavyPurple};
  background-color: ${(props) => props.theme.colors.freezePurple};
  border-radius: 50%;
`;

export const GameInfoPlayerInfo = styled.div`
  width: calc(100% - 150px);
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const GameInfoPlayerInfoNickname = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
  text-align: center;
`;

export const GameInfoPlayerInfoScore = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const GameInfoMiddle = styled.div`
  width: 20%;
  height: 150px;
  display: flex;
  flex-direction: column;
`;

export const GameInfoMiddleTop = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GameInfoMiddleCenter = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
`;
