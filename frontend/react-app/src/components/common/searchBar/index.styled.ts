import { styled } from "styled-components";
import MagnifyingGlass from "@assets/icons/MagnifyingGlass.svg";

export const Form = styled.form`
  width: 600px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.floating};
  border-radius: 30px;
  padding-inline: 15px;
  margin-block: 50px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
`;

export const Input = styled.input`
  height: 100%;
  flex-grow: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.heavyPurple};
`;

export const Button = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  outline: none;
  background: none;
  background-image: url(${MagnifyingGlass});
  background-repeat: no-repeat;
  cursor: pointer;
`;
