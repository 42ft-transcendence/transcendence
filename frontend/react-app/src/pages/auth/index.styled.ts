import { styled } from "styled-components";
import InputBG from "@assets/backgrounds/6digit-input-bg.svg";

export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 600px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 20px;
`;

export const LoadingImage = styled.img`
  width: 100px;
  height: 200px;
  object-fit: contain;
`;

export const TwoFactorTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.freezePurple};
  margin-bottom: 20px;
`;

export const TwoFactorDescription = styled.p`
  font-size: 16px;
  font-weight: regular;
  color: ${(props) => props.theme.colors.freezePurple};
  margin-bottom: 20px;
`;

export const TwoFactorInput = styled.input`
  margin-left: 20px;
  padding-left: 10px;
  width: 240px;
  height: 40px;
  font-family: monospace;
  font-size: 24px;
  letter-spacing: 1em;
  background: none;
  background-image: url(${InputBG});
  background-repeat: no-repeat;
  outline: none;
  border: none;
  overflow: hidden;
`;
