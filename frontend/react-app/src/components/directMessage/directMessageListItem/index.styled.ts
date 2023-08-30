import { styled } from "styled-components";
import { UserStatus } from "@src/types";

export const Container = styled.li`
  width: 190px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: end;
`;

export const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const Status = styled.div<{ $status: UserStatus }>`
  position: absolute;
  width: 10px;
  height: 10px;
  left: 30px;
  top: 30px;
  border-radius: 50%;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case UserStatus.ONLINE:
        return theme.colors.online;
      case UserStatus.GAMING:
        return theme.colors.gaming;
      case UserStatus.OFFLINE:
        return theme.colors.offline;
      default:
        return "rgba(0, 0, 0, 0)";
    }
  }};
`;

export const Title = styled.h3`
  height: 40px;
  padding: 0;
  margin: 0 5px;
  color: ${(props) => props.theme.colors.freezePurple};
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  flex-grow: 1;
  overflow: hidden;
`;

// export const Rank = styled.span`
//   height: 12px;
//   background-image: url(${User});
//   background-size: 12px;
//   background-repeat: no-repeat;
//   padding-left: 12px;
//   font-size: 12px;
//   font-weight: bold;
//   color: rgba(0, 0, 0, 0.5);
//   line-height: 12px;
// `;

export const NewMessage = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.gaming};
  right: 0;
  top: 16px;
`;
