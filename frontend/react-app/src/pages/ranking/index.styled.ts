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
  height: calc(100% - 120px);
  display: flex;
  margin-top: 30px;
  background-color: ${(props) => props.theme.colors.lose};
  align-items: center;
  justify-content: center;
`;
