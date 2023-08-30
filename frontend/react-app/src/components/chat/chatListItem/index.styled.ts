import { RoleType } from "@src/types";
import { styled } from "styled-components";
import Owner from "@assets/icons/role_owner.svg";
import Admin from "@assets/icons/role_admin.svg";

export const Container = styled.li<{ $isMine: boolean }>`
  display: flex;
  width: 100%;
  min-height: 60px;
  justify-content: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
`;

export const ProfileImage = styled.img<{ $role: RoleType }>`
  width: 50px;
  height: 50px;
  top: 5px;
  left: 5px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.floating};
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);

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

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Nickname = styled.h3`
  height: 20px;
  margin: 0 0 0 20px;
  color: ${(props) => props.theme.colors.heavyPurple};
  font-size: 16px;
`;
