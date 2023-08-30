import { useState } from "react";
import * as S from "./index.styled";

export interface SideBarListPropsType {
  title: string;
  children?: React.ReactNode;
}

const SideBarList = ({ title, children }: SideBarListPropsType) => {
  const [isFolded, setIsFolded] = useState(false);

  const handleHeaderClick = () => {
    setIsFolded((prev) => !prev);
  };

  return (
    <S.Container>
      <S.Header onClick={handleHeaderClick} $isFolded={isFolded}>
        {title}
      </S.Header>
      {!isFolded && <S.List>{children}</S.List>}
    </S.Container>
  );
};

export default SideBarList;
