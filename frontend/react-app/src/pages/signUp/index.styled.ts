import { styled } from "styled-components";
import { Theme } from "@styles/Theme";

export const SignUpTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: ${Theme.colors.freezePurple};
  margin-top: 40px;
`;

export const ProfileImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-top: 40px;
  margin-bottom: 10px;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  object-fit: contain;
`;

export const PencilIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 35px;
  height: 35px;
  background: url("src/assets/icons/pencil.svg") no-repeat;
  background-size: cover;
  cursor: pointer;
`;

export const DuplicatedNicknameText = styled.div.attrs<{ $validated: string }>(
  ({ $validated }) => ({
    style: {
      color: $validated === "true" ? Theme.colors.win : Theme.colors.lose,
    },
  }),
)<{ $validated: string }>`
  width: 292px;
  height: 16px;
  outline: none;
  font-size: 10px;
  font-family: inter;
  background: none;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-bottom: 34px;
`;

export const SignUpButtonContainer = styled.div`
  display: flex;
  gap: 50px;
`;
