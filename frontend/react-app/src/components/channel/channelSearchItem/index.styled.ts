import { styled } from "styled-components";
import User from "@assets/icons/User.svg";
import Hash from "@assets/icons/Hash.svg";
import Lock from "@assets/icons/LockKey.svg";
import Detect from "@assets/icons/Detective.svg";
import { ChannelTypeType } from "@type";

const channelTypeIcon: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: Hash,
  [ChannelTypeType.PRIVATE]: Detect,
  [ChannelTypeType.PROTECTED]: Lock,
};

export const Container = styled.li`
  width: 360px;
  height: 100px;
  background-color: ${({ theme }) => theme.colors.heavyPurple};
  border-radius: 20px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
`;

export const Title = styled.h3`
  width: 100%;
  height: 50px;
  padding: 0;
  margin: 0;
  font-size: 30px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.freezePurple};
  line-height: 50px;
  text-overflow: hidden;
`;

export const Status = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChannelType = styled.span<{ $type: ChannelTypeType }>`
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.freezePurple};
  line-height: 20px;

  &:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 20px;
    background-image: url(${({ $type }) => channelTypeIcon[$type]});
    background-size: 20px;
    background-repeat: no-repeat;
  }
`;

export const Participants = styled.span`
  height: 15px;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.5);

  &:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 20px;
    background-image: url(${User});
    background-size: 20px;
    background-repeat: no-repeat;
  }
`;
