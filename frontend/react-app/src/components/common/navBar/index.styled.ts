import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 50px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border-right: 1px solid ${(props) => props.theme.colors.darkFreezePurple};
`;

export const TabList = styled.ul`
  display: flex;
  width: 100%;
  height: max-content;
  margin-block: 10px;
  gap: 18px;
  flex-direction: column;
  align-items: center;
`;

export const ItemIcon = styled.img`
  width: 32px;
  height: 32px;
`;
