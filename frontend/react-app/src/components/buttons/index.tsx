import * as S from "./index.styled";

export interface IconButtonProps {
  title: string;
  iconSrc?: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

export const IconButton = ({
  title,
  iconSrc,
  onClick,
  theme,
}: IconButtonProps) => (
  <S.IconButton mode={theme} onClick={onClick}>
    <span>{title}</span>
    {iconSrc && <img src={iconSrc} alt={title} />}
  </S.IconButton>
);

export interface TextButtonProps {
  title: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

export const TextButton = ({ title, onClick, theme }: TextButtonProps) => (
  <S.TextButton mode={theme} onClick={onClick}>
    {title}
  </S.TextButton>
);
