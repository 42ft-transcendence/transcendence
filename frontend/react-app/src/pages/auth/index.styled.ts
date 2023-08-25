import { styled } from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const LoadingImage = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transition: translate(-50%, -50%);
`;
