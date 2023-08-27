import { styled } from "styled-components";

export const TopRankerContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
`;

export const TopRankerImg = styled.img`
  width: 40px;
  height: 40px;
  margin-left: 10px;
`;

export const TopRankerNickname = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  color: ${(props) => props.theme.colors.freezePurple};
  cursor: pointer;
`;

export const TopRankerRating = styled.span<{ $ranking: number }>`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => {
    return props.$ranking === 1
      ? props.theme.colors.gold
      : props.$ranking === 2
      ? props.theme.colors.silver
      : props.theme.colors.bronze;
  }};
`;
