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

  /* 자동 완성 배경색 및 폰트 스타일 제어 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${(props) =>
      props.theme.colors.heavyPurple}; /* 텍스트 색상 */
    font-size: 20px; /* 폰트 크기 */
    font-family: inter; /* 폰트 종류 */
    font-weight: bold; /* 폰트 두께 */
  }
`;

export const SearchBarImg = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 20px;
`;
