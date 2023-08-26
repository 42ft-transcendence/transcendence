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

export const PeopleIconModalContentWrapper = styled.div`
  display: flex;
  width: 200px;
  height: 200px;
  flex-direction: column;
`;

export const PeoPleIconModalButton = styled.span`
  fond-size: 30px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
  padding: 0px;
  margin: 0px;
  cursor: pointer;
  color: black;
`;

export const Divider = styled.div`
  border-top: 1px solid #ccc;
  margin: 10px 0px;
  width: 50%;
`;
