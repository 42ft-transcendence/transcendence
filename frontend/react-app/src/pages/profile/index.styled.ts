import { styled } from "styled-components";

export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  flex-direction: column;
  align-items: center;
`;

export const HeaderToolBar = styled.div`
  display: flex;
  width: 98%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-radius: 7px 7px 0 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.freezePurple};
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const SearchBar = styled.div`
  width: 274px;
  height: 35px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 7px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    width: 40%; // 예: 1000px 미만일 때 80%의 너비로 변경. 실제 값을 원하는대로 조정하십시오.
  }
`;

export const SearchBarInput = styled.input`
  width: 80%;
  height: 52px;
  outline: none;
  font-size: 20px;
  background: none;
  font-weight: bold;
  border: none;
  margin-left: 25px;
  margin-top: 5px;
  color: ${(props) => props.theme.colors.freezePurple};

  &::placeholder {
    /* placeholder 색상 변경 */
    color: ${(props) => props.theme.colors.heavyPurple};
  }

  /* 자동 완성 배경색 및 폰트 스타일 제어 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${(props) =>
      props.theme.colors.freezePurple}; /* 텍스트 색상 */
    font-size: 20px; /* 폰트 크기 */
    font-family: inter; /* 폰트 종류 */
    font-weight: bold; /* 폰트 두께 */
  }
`;

export const SearchBarImg = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 10px;
`;

export const HeaderStatistcs = styled.div`
  display: flex;
  width: 98%;
  height: 150px;
  align-items: center;
  flex-direction: row;
  border-radius: 0 0 7px 7px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const HeaderDoughnutContainer = styled.div`
  display: flex;
  width: 150px;
  height: 100%;
  flex-direction: column;
`;

export const HeaderDoughnutText = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: inter;
  margin-left: 14px;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const HeaderDoughnut = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  position: relative;
`;

export const DoughnutText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 화면의 정확한 중앙에 배치 */
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const HeaderAvgContainer = styled.div`
  display: flex;
  width: 150px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const HeaderAvgTotalScore = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  font-size: 14px;
  font-family: inter;
  align-items: center;
  color: ${(props) => props.theme.colors.floating};
`;

export const HeaderAvgScore = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  font-family: inter;
  align-items: center;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const HeaderMapContainer = styled.div`
  display: flex;
  width: 150px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const HeaderMapTitle = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  font-size: 18px;
  font-weight: bold;
  font-family: inter;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.freezePurple};
`;

export const HeaderMapStats = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  font-size: 14px;
  font-family: inter;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.floating};
`;

export const HeaderMapStatsWinRate = styled.p<{ win: number; lose: number }>`
  margin-left: 10px;
  color: ${(props) =>
    props.win > props.lose ? "red" : props.theme.colors.floating};
`;

export const Header10gamesContainer = styled.div`
  display: flex;
  width: calc(100% - 450px);
  height: 100%;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.gold};
`;

export const MatchContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 200px);
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  margin-top: 10px;
`;

export const MatchCard = styled.div<{ mode: string }>`
  display: flex;
  width: 98%;
  height: 100px;
  margin-bottom: 10px;
  border-radius: 7px;
  border-left: 7px solid
    ${(props) =>
      props.mode === "승리"
        ? props.theme.colors.deepWin
        : props.theme.colors.deepLose};
  background-color: ${(props) =>
    props.mode === "승리"
      ? props.theme.colors.win
      : props.mode === "패배"
      ? props.theme.colors.lose
      : props.theme.colors.floating};
`;

export const MatchCardMatchInfo = styled.div`
  display: flex;
  width: 12%;
  height: 100px;
  gap: 7px;
  flex-direction: column;
  justify-content: center;
`;

export const MatchCardMatchInfoGameType = styled.div<{ mode: string }>`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) =>
    props.mode === "승리" ? "blue" : props.mode === "패배" ? "red" : "gray"};
`;

export const MatchCardMatchInfoDate = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardMatchInfoDivider = styled.div`
  width: 40%;
  height: 0.5px;
  margin-left: 7px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardMatchInfoWinLose = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardProfile = styled.div`
  display: flex;
  width: 28%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const MatchCardProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-left: 20px;
  background-color: ${(props) => props.theme.colors.floating};
  cursor: pointer;
`;

export const MatchCardProfileNickname = styled.span`
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.heavyPurple};
  cursor: pointer;
`;

export const MatchCardScoreContainer = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const MatchCardScoreMap = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardScoreTextContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  font-size: 32px;
  font-weight: bold;
  font-family: inter;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const MatchCardScoreChangeContainer = styled.div<{
  mode: string;
  $winLose: string;
}>`
  display: flex;
  width: 12%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) =>
    props.mode === "rank" && props.$winLose === "승리"
      ? "blue"
      : props.mode === "rank" && props.$winLose === "패배"
      ? "red"
      : props.theme.colors.heavyPurple};
`;
