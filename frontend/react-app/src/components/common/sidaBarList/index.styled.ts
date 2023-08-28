import { styled } from "styled-components";
import CaretDown from "@assets/icons/CaretDown.svg";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 230px;
  margin-top: 10px;
`;

export const Header = styled.div<{ isFolded: boolean }>`
  display: flex;
  width: 100%;
  height: 28px;
  margin: 0 0 10px;
  color: ${(props) => props.theme.colors.freezePurple};
  font-size: 16px;
  font-weight: Bold;
  line-height: 28px;
  cursor: pointer;
  overflow: hidden;

  &:before {
    content: "";
    width: 28px;
    height: 28px;
    background-image: url(${CaretDown});
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotate(${(props) => (props.isFolded ? "-90deg" : "0")});
    transition: 0.3s ease-in-out;
    z-index: 99;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding-left: 10%;
  margin: 0;
`;
