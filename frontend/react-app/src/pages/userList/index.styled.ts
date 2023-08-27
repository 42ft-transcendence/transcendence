import { styled } from "styled-components";

export const SearchBarContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
`;

export const SearchBar = styled.div`
  width: 560px;
  height: 60px;
  background-color: ${(props) => props.theme.colors.floating};
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  margin-left: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    width: 80%; // 예: 1000px 미만일 때 80%의 너비로 변경. 실제 값을 원하는대로 조정하십시오.
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
