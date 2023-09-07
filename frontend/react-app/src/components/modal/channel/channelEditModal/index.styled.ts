import { styled } from "styled-components";

import Hash from "@assets/icons/Hash.svg";
import Detective from "@assets/icons/Detective.svg";
import Lock from "@assets/icons/LockKey.svg";
import { ChannelTypeType } from "@src/types";

const channelTypeIcon: { [key in ChannelTypeType]: string } = {
  [ChannelTypeType.PUBLIC]: Hash,
  [ChannelTypeType.PROTECTED]: Lock,
  [ChannelTypeType.PRIVATE]: Detective,
};

export const ModalOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 240;
`;

export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
  background-color: ${({ theme }) => theme.colors.heavyPurple};
  border: 1px solid ${({ theme }) => theme.colors.freezePurple};
  border-radius: 30px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  z-index: 241;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 350px;
  margin-block: 50px;
`;

export const NameInput = styled.input`
  width: 250px;
  height: 40px;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.freezePurple};
  outline: none;
  color: ${({ theme }) => theme.colors.freezePurple};
  font-size: 32px;
  font-weight: Bold;
  line-height: 40px;
  text-align: center;
`;

export const Option = styled.div`
  display: flex;
  width: 300px;
  height: 40px;
`;

export const OptionLabel = styled.h5`
  width: 100px;
  height: 40px;
  margin: 0;
  color: ${({ theme }) => theme.colors.freezePurple};
  font-size: 20px;
  font-weight: Bold;
  line-height: 40px;
  text-align: center;
`;

export const OptionContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const TypeButton = styled.button<{ $type: ChannelTypeType }>`
  height: 24px;
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
    background-image: url(${({ $type }) => channelTypeIcon[$type]});
    background-size: 24px;
    background-repeat: no-repeat;
  }
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
