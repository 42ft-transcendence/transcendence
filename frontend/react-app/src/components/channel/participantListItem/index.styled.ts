import { styled } from "styled-components";
import { RoleType, UserStatus } from "@src/types";
import Owner from "@assets/icons/role_owner.svg";
import Admin from "@assets/icons/role_admin.svg";

export const Container = styled.li`
  width: 190px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: end;
`;

export const Profile = styled.img<{ $role: RoleType }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.floating};

  &:after {
    position: absolute;
    content: "";
    width: 24px;
    height: 24px;
    left: 30px;
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: top;

    ${(props) => {
      switch (props.$role) {
        case "owner":
          return `background-image: url(${Owner});`;
        case "admin":
          return `background-image: url(${Admin});`;
        default:
          return `display: none;`;
      }
    }}
  }
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

export const Title = styled.h3<{ $isMe: boolean }>`
  height: 40px;
  padding: 0;
  margin: 0 5px;
  color: ${({ theme, $isMe }) =>
    $isMe ? theme.colors.myChat : theme.colors.freezePurple};
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  flex-grow: 1;
  overflow: hidden;
`;
