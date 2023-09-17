import { styled } from "styled-components";
import User from "@assets/icons/User.svg";

export const Container = styled.li`
  width: 190px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: end;
`;

export const ChannelIcon = styled.img`
  width: 36px;
  height: 40px;
  object-fit: contain;
`;

export const Title = styled.h3<{ $isCur: boolean }>`
  height: 40px;
  padding: 0;
  margin: 0 5px;
  color: ${({ theme, $isCur }) =>
    $isCur ? theme.colors.myChat : theme.colors.freezePurple};
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  flex-grow: 1;
  overflow: hidden;
`;

export const Participants = styled.span`
  height: 12px;
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.5);

  &:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 14px;
    height: 12px;
    background-image: url(${User});
    background-size: 12px;
    background-repeat: no-repeat;
`;

export const NewMessage = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.gaming};
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;
