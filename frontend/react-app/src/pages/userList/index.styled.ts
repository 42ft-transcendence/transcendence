import { styled } from "styled-components";

export const SearchBarContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
`;

export const SearchBar = styled.div`
  width: 490px;
  height: 60px;
  background-color: ${(props) => props.theme.colors.floating};
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  margin-left: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    width: 70%; // 예: 1000px 미만일 때 80%의 너비로 변경. 실제 값을 원하는대로 조정하십시오.
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
`;

export const SearchBarImg = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 20px;
`;

export const SortContainer = styled.div`
  position: relative; /* 추가 */
  width: 120px;
  height: 60px;
  margin-left: 30px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const SortArrowIcon = styled.span<{ $isOpen: boolean }>`
  transform: translate(-50%, -50%)
    rotate(${(props) => (props.$isOpen ? "-90deg" : "90deg")});
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid ${(props) => props.theme.colors.heavyPurple}; /* Adjust the size of the triangle */
  margin-top: 10px;
  margin-left: 15px;
  cursor: pointer;
`;

export const SortDropdown = styled.div`
  position: absolute;
  top: 50px; /* SortContainer의 높이 + 약간의 간격 */
  left: -12px;
  width: 180px; /* 필요한 경우 크기 조절 */
  background-color: ${(props) => props.theme.colors.floating};
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 10; /* 다른 요소 위에 올라오도록 함 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const SortOption = styled.button`
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: ${(props) => props.theme.colors.heavyPurple};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1); /* 마우스 오버 효과 */
  }
`;

export const UserCardContainer = styled.div`
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
  overflow-y: auto;
`;

export const UserCard = styled.div`
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

export const UserCardImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin-left: 30px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const UserCardStatus = styled.div<{ $status: number }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-left: -15px;
  margin-top: 50px;
  background-color: ${(props) => {
    return props.$status === 0
      ? props.theme.colors.online
      : props.$status === 1
      ? props.theme.colors.gaming
      : props.theme.colors.offline;
  }};
`;

export const UserCardNickname = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.freezePurple};
  margin-left: 30px;
  cursor: pointer;
`;

export const UserCardRankContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
  gap: 10px;
`;

export const UserCardRankImg = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const UserCardRank = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.gold};
  margin-left: 30px;
  cursor: pointer;
`;
