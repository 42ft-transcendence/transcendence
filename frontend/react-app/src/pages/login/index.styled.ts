import { styled } from "styled-components";

export const PageContainer = styled.div`
  position: fixed; // 화면에 고정
  top: 0; // 상단에서부터 0px 위치
  left: 0; // 왼쪽에서부터 0px 위치
  right: 0; // 오른쪽에서부터 0px 위치
  bottom: 0; // 하단에서부터 0px 위치
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #e5eaf5;
`;

export const LoginContainer = styled.div`
  width: 400px;
  height: 600px;
  // 화면 중앙에 위치
  margin: auto;
  // 테두리
  border-radius: 20px;
  background-color: #494d5f;

  // 내용은 중앙에 위치
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
`;

export const LoginLogoImage = styled.img`
  width: 300px;
  height: 300px;
  margin-bottom: 80px;
`;

export const LoginButtonImageContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 2px;
  width: 46.65px;
  height: 46.65px;
  border: 1px solid ${(props) => props.color}};
`;

export const LoginButtonImage = styled.img`
  background-color: white;
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 2px;
`;

export const LoginButtonText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 180px;
`;

export const LoginButtonContainer = styled.a<{ color: string }>`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.color};
  border-radius: 2px;
  width: 225px;
  height: 48.65px;
  text-decoration: none; /* 링크의 기본 밑줄 제거 */
  color: #333; /* 링크 색상 설정 */
`;
