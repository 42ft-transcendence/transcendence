import { buttonHandlerProps } from "@src/types";
import * as S from "./index.styled";
import * as cookies from "react-cookies";

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

export const buttonHandler = ({ todo, navigate }: buttonHandlerProps) => {
  todo()
    .then((response) => {
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        cookies.remove("jwt", { path: "/" });
        // setIsFirstLogin(true);
        navigate("/login");
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
