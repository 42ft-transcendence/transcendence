import { styled } from "styled-components";

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: fixed; /* 화면에 고정 */
  top: 50%; /* 화면의 중앙에 위치시킴 */
  left: 50%; /* 화면의 중앙에 위치시킴 */
  transform: translate(-50%, -50%); /* 화면의 정확한 중앙에 배치 */

  z-index: 300; /* 다른 요소 위에 오도록 z-index를 높게 설정, navBar는 300부터 */
  background-color: rgba(0, 0, 0, 0); /* 반투명한 배경 */
  width: 100vw; /* 화면의 너비 전체 */
  height: 100vh; /* 화면의 높이 전체 */
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  width: 400px;
  // 높이는 최소 725px, 그 이상은 내용에 따라 늘어남
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  min-height: 725px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border-radius: 30px;
  border: 4px solid ${(props) => props.theme.colors.freezePurple};
`;

export const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  margin-top: 50px;
  border-radius: 50%;
`;

export const ProfileNickname = styled.div`
  width: 300px;
  height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.freezePurple};
  font-family: inter;
`;

export const ProfileRatingContainer = styled.div`
  width: 250px;
  min-height: 205px;
  color: ${(props) => props.theme.colors.freezePurple};
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  overflow: hidden;
`;

export const ProfileRatingTextContainer = styled.div`
  width: 100%;
  height: 25px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  font-family: inter;
  between: 5px;
`;

export const ProfileRatingEachImgContainer = styled.img`
  width: 25px;
  height: 25px;
`;

export const ProfileRatingEachTextContainer = styled.div<{ color: string }>`
  width: 40px;
  height: 100%;
  font-size: 12px;
  font-weight: bold;
  font-family: inter;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  // color는 props로 받아옴
  color: ${(props) => props.color};
`;

export const ProfileButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 260px;
  min-height: 180px;
  margin-top: 10px;
  margin-bottom: 20px;

  // 모든 버튼에 그림자 효과 적용
  & > button {
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  }

  & > button:nth-child(odd) {
    // 홀수 버튼에만 적용
    margin-right: 20px; // 오른쪽 마진
    margin-bottom: 20px; // 아래 마진
  }
`;
