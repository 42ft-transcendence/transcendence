import { Theme } from "@src/styles/Theme";
import styled from "styled-components";
import Hash from "@assets/icons/Hash.svg";
import Detective from "@assets/icons/Detective.svg";
import Lock from "@assets/icons/LockKey.svg";

const GameTypeIcon = {
  PUBLIC: Hash,
  PROTECTED: Lock,
  PRIVATE: Detective,
};

export const ModalOverlay = {
  background: "transparent",
  justifyContent: "center",
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
};

export const ModalContent: React.CSSProperties = {
  backgroundColor: Theme.colors.heavyPurple,
  inset: "auto",
  width: "700px",
  height: "550px",
  border: `2px solid ${Theme.colors.freezePurple}`,
  display: "flex",
  flexDirection: "column",
  // justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  // overflow: "auto",
};

export const gameCreateModalTitle = styled.h2`
  font-size: 10px;
  font-weight: bold;
  font-family: inter;
  // margin-bottom: 1px;
  color: white;
`;

export const gameCreateModalLabel = styled.label`
  font-size: 24px;
  margin-right: 150px;
  margin-top: 30px;
  color: ${Theme.colors.freezePurple};
  font-weight: bold;
`;

export const gameCreateModalInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  color: white;

  border: 1px solid #ccc;
`;

export const gameCreateModalButton = styled.button`
  margin-top: 1rem;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

export const InputBoxWrapper = styled.input`
  width: 80%;
  height: 40px;
  outline: none;
  font-size: 20px;
  background: none;
  text-align: center;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid ${Theme.colors.freezePurple};
  color: ${Theme.colors.freezePurple};
  margin-top: 20px;
`;

export const GameSpeedButtons = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

export const gameCreateOption = styled.div`
  display: flex;
  width: 80%;
  justify-content: start;
`;

export const TypeButton = styled.button<{ type: string }>`
  height: 20px;
  background: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.freezePurple};
  font-size: 20px;
  font-weight: Bold;
  line-height: 24px;
  text-align: center;
  cursor: pointer;

  &:before {
    content: "";
    display: inline-block;
    width: 30px;
    height: 24px;
    background-image: url(${({ type }) =>
      GameTypeIcon[type as keyof typeof GameTypeIcon]});
    background-size: 24px;
    background-repeat: no-repeat;
  }
`;

export const OptionContent = styled.div`
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const GameSpeedButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  width: 100px;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${Theme.colors.iceCold};
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  margin: 0 0.25rem;
  background-color: ${({ $selected }) =>
    $selected ? `${Theme.colors.iceCold}` : "transparent"};
  color: ${({ $selected }) =>
    $selected ? `${Theme.colors.heavyPurple}` : `${Theme.colors.freezePurple}`};
`;

export const PasswordInput = styled.input`
  width: 150px;
  height: 24px;
  background: none;
  background-image: url(${Lock});
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: right;
  padding-right: 24px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.freezePurple};
  outline: none;
  color: ${({ theme }) => theme.colors.freezePurple};
  font-size: 20px;
  font-weight: Bold;
  line-height: 40px;
  text-align: center;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  height: 40px;
`;

export const mapbox = styled.img`
  width: 220px;
  height: 165px;
  background: white;
  border: 2px solid ${Theme.colors.freezePurple};
`;
