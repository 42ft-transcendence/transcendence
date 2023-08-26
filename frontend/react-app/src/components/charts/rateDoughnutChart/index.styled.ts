import { styled } from "styled-components";
import { Theme } from "@src/styles/Theme";

export const RatingContainer = styled.div`
  width: 250px;
  min-height: 205px;
  color: ${(props) => props.theme.colors.freezePurple};
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  overflow: hidden;
`;

export const RatingTextContainer = styled.div`
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

export const RatingEachImgContainer = styled.img`
  width: 25px;
  height: 25px;
`;

export const RatingEachTextContainer = styled.div<{ color: string }>`
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

export const DoughnutContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
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
`;

export const DoughnutSlideCircleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DoughnutSlideCircle = styled.div<{
  $status: number;
  $select: number;
}>`
  width: 8px;
  height: 8px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  margin: 0 4px;
  background-color: ${(props) =>
    props.$status === props.$select
      ? Theme.colors.freezePurple
      : Theme.colors.darkFreezePurple};
`;
