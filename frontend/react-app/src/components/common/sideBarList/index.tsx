import { useState } from "react";
import * as S from "./index.styled";

export interface SideBarFoldListPropsType {
  title: string;
  children?: React.ReactNode;
}

export const SideBarFoldList = ({
  title,
  children,
}: SideBarFoldListPropsType) => {
  const [isFolded, setIsFolded] = useState(false);

  const handleHeaderClick = () => {
    setIsFolded((prev) => !prev);
  };

  return (
    <S.FoldContainer>
      <S.Header onClick={handleHeaderClick} $isFolded={isFolded}>
        {title}
      </S.Header>
      {!isFolded && <S.List>{children}</S.List>}
    </S.FoldContainer>
  );
};

export interface SideBarListPropsType {
  lists: SideBarFoldListPropsType[];
}

const SideBarList = ({ lists }: SideBarListPropsType) => (
  <S.Container>
    {lists.map((list) => (
      <SideBarFoldList key={list.title} title={list.title}>
        {list.children}
      </SideBarFoldList>
    ))}
  </S.Container>
);

export default SideBarList;
