import { styled } from "styled-components";
import RankingIcon from "@assets/icons/ranking.svg";

export const UserCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-auto-rows: 100px;
  grid-gap: 40px;
  width: 80%;
  margin-left: 10%;
  margin-top: 50px;
  flex-grow: 1;
  justify-content: center;
  align-items: flex-start;

  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.floating};
    border-radius: 4px;
  }
`;

export const UserCard = styled.div`
  position: relative;
  width: 360px;
  height: 100px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border-radius: 20px;
  align-items: center;
  display: flex;
  cursor: pointer;
  padding-inline: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
`;

export const UserCardImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const UserCardStatus = styled.div<{ $status: number }>`
  position: absolute;
  left: 70px;
  top: 70px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => {
    return props.$status === 0
      ? props.theme.colors.online
      : props.$status === 1
      ? props.theme.colors.gaming
      : props.theme.colors.offline;
  }};
`;

export const UserCardNickname = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.freezePurple};
  margin-left: 30px;
  cursor: pointer;
  flex-grow: 1;
  overflow: hidden;
`;

export const UserCardRank = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.gold};
  margin-left: 30px;
  cursor: pointer;
  flex-shrink: 0;

  &:before {
    content: "";
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: bottom;
    background: none;
    background-image: url(${RankingIcon});
    background-size: 30px;
    background-repeat: no-repeat;
  }
`;
