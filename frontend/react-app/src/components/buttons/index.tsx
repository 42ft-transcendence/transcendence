import * as S from "./index.styled";

export interface IconButtonProps {
  title: string;
  iconSrc?: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

export interface IconButtonListProps {
  iconButtons: IconButtonProps[];
}

export const IconButton = ({
  title,
  iconSrc,
  onClick,
  theme,
}: IconButtonProps) => (
  <S.IconButton mode={theme} onClick={onClick}>
    <>{title}</>
    {iconSrc && <img src={iconSrc} alt={title} />}
  </S.IconButton>
);

export const IconButtonList = ({ iconButtons }: IconButtonListProps) => {
  return (
    <S.IconButtonList>
      {iconButtons.map((iconButton) => (
        <IconButton
          key={iconButton.title}
          title={iconButton.title}
          iconSrc={iconButton.iconSrc}
          onClick={iconButton.onClick}
          theme={iconButton.theme}
        />
      ))}
    </S.IconButtonList>
  );
};

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
