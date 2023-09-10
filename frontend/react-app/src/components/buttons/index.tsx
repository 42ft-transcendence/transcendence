import { ButtonHandlerProps } from "@src/types";
import * as S from "./index.styled";
import * as cookies from "react-cookies";

export interface IconButtonProps {
  title: string;
  iconSrc?: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

export interface ButtonListProps {
  buttons: (IconButtonProps | DoubleTextButtonProps)[];
  style?: React.CSSProperties;
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

export interface DoubleTextButtonProps {
  text1: string;
  text2: string;
  onClick?: () => void;
  theme: "LIGHT" | "DARK";
}

export const DoubleTextButton = ({
  text1,
  text2,
  onClick,
  theme,
}: DoubleTextButtonProps) => (
  <S.DoubleTextButton mode={theme} onClick={onClick}>
    <div>{text1}</div>
    <div>{text2}</div>
  </S.DoubleTextButton>
);

export const ButtonList = ({ buttons, style }: ButtonListProps) => {
  return (
    <S.ButtonList style={style}>
      {buttons.map((buttonProps, index) => {
        if ("text1" in buttonProps && "text2" in buttonProps) {
          // 이것은 DoubleTextButton입니다.
          return (
            <DoubleTextButton
              key={index}
              text1={buttonProps.text1}
              text2={buttonProps.text2}
              onClick={buttonProps.onClick}
              theme={buttonProps.theme}
            />
          );
        } else {
          // 이것은 IconButton입니다.
          return (
            <IconButton
              key={index}
              title={buttonProps.title}
              iconSrc={buttonProps.iconSrc}
              onClick={buttonProps.onClick}
              theme={buttonProps.theme}
            />
          );
        }
      })}
    </S.ButtonList>
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

export const ButtonHandler = ({
  todo,
  navigate,
  setIsFirstLogin,
}: ButtonHandlerProps) => {
  todo()
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        cookies.remove("jwt", { path: "/" });
        setIsFirstLogin(true);
        navigate("/login");
      }
    })
    .catch((error) => {
      void error;
    });
};
