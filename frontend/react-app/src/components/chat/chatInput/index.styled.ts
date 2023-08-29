import { styled } from "styled-components";
import Game from "@assets/icons/GameControllerDark.svg";
import User from "@assets/icons/UserPlus.svg";
import Send from "@assets/icons/PaperPlaneTiltDark.svg";

export const Container = styled.div`
  display: flex;
  width: max-content;
  height: min-content;
  margin-bottom: 50px;
`;

export const InviteButton = styled.button<{ isChannel: boolean }>`
  display: flex;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 30px;
  margin-right: 10px;
  outline: none;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);

  background-color: ${(props) => props.theme.colors.floating};
  background-image: url(${({ isChannel }) => (isChannel ? User : Game)});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 32px;
`;

export const Form = styled.form`
  display: flex;
  width: 600px;
  height: 60px;
  background-color: ${(props) => props.theme.colors.floating};
  border: none;
  border-radius: 30px;
  justify-content: center;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
`;

export const Input = styled.input`
  margin-inline: 20px;
  flex-grow: 1;
  background: none;
  border: none;
  outline: none;
  color: ${(props) => props.theme.colors.heavyPurple};
  font-size: 16px;
`;

export const SendButton = styled.button`
  width: 60px;
  height: 60px;
  background: none;
  border: none;
  outline: none;

  background-image: url(${Send});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 32px;
`;
