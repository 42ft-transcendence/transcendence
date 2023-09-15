import { styled } from "styled-components";
import User from "@assets/icons/User.svg";

export const Container = styled.div`
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  align-items: center;
  padding-inline: 10px;
`;

export const Icon = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  height: 40px;
  margin: 0;
  color: ${({ theme }) => theme.colors.heavyPurple};
  font-size: 20px;
  font-weight: Bold;
  line-height: 40px;
  flex-grow: 1;
  padding-inline: 10px;
  overflow: hidden;
`;

export const Participants = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: Regular;
  line-height: 40px;
  flex-shrink: 0;

  &:before {
    content: " ";
    background: none;
    background-image: url(${User});
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
`;
