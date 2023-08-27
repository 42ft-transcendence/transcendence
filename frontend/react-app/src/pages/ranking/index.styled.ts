import { styled } from "styled-components";

export const ToolBarContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  margin-top: 30px;
  background-color: ${(props) => props.theme.colors.gaming};
  justify-content: space-between;
  align-items: center;
`;

export const TierContainer = styled.div`
  width: 100px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const SearchContainer = styled.div`
  width: 170px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const RankingContainer = styled.div`
  width: 100%;
  height: calc(100% - 120px); // height 대신 min-height를 사용
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

export const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  border-bottom: 2px solid #e1e1e1; // 두께를 좀 더 두꺼워서 구분을 뚜렷하게 함
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #e1e1e1;
`;

export const Rank = styled.span`
  width: 30px;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const Nickname = styled.span`
  flex: 1;
  font-size: 18px;
`;

export const Tier = styled.span`
  width: 150px;
  font-size: 16px;
  font-weight: bold;
`;

export const Record = styled.span`
  width: 100px;
  font-size: 16px;
`;

export const WinRateContainer = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  gap: 5px;
  right: 0;
`;

export const WinRate = styled.span`
  width: 100px; // 조절 가능
  font-size: 16px;
  font-weight: bold;
`;

export const WinRateChart = styled.div`
  width: 150px;
  height: 20px;
  position: relative;
`;

export const WinBar = styled.div`
  position: absolute;
  height: 100%;
  left: 0;
  background-color: ${(props) => props.theme.colors.win}};
`;

export const LoseBar = styled.div`
  position: absolute;
  height: 100%;
  right: 0;
  background-color: ${(props) => props.theme.colors.lose}}};
`;

export const WinText = styled.span`
  position: absolute;
  left: 5px;
  color: ${(props) => props.theme.colors.freezePurple}};
`;

export const LoseText = styled.span`
  position: absolute;
  right: 5px;
  color: ${(props) => props.theme.colors.freezePurple}};
`;
