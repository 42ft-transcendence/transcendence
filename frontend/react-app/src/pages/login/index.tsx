import {
  LoginButtonContainer,
  LoginButtonImage,
  LoginButtonImageContainer,
  LoginButtonText,
  LoginContainer,
  LoginLogoImage,
  PageContainer,
} from "./index.styled";
import CCPPLogo from "@assets/logos/ccpp_logo.png";
import GoogleLogo from "@assets/logos/google_logo.svg";
import FTLogo from "@assets/logos/42_logo.svg";

const ft_oauth = {
  base_url: "https://api.intra.42.fr/oauth/authorize",
  client_id: process.env.VITE_FT_OAUTH_CLIENT_ID as string,
  redirect_uri: process.env.VITE_FT_OAUTH_REDIRECT_URI as string,
};

const google_oauth = {
  base_url: "https://accounts.google.com/o/oauth2/v2/auth",
  client_id: process.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string,
  redirect_uri: process.env.VITE_GOOGLE_OAUTH_REDIRECT_URI as string,
};

export const LoginButton = ({
  href,
  src,
  type,
}: {
  href: string;
  src: string;
  type: string;
}) => {
  const colorTheme = type === "42" ? "#00babc" : "#4285f4";

  return (
    <LoginButtonContainer href={href} color={colorTheme}>
      <LoginButtonImageContainer color={colorTheme}>
        <LoginButtonImage src={src} />
      </LoginButtonImageContainer>
      <LoginButtonText>Sign in With {type}</LoginButtonText>
    </LoginButtonContainer>
  );
};

export default function Login() {
  const oauth_forty_two = `${ft_oauth.base_url}?client_id=${encodeURIComponent(
    ft_oauth.client_id,
  )}&redirect_uri=${encodeURIComponent(
    ft_oauth.redirect_uri,
  )}&response_type=code`;
  const oauth_google = `${google_oauth.base_url}?client_id=${encodeURIComponent(
    google_oauth.client_id,
  )}&redirect_uri=${encodeURIComponent(
    google_oauth.redirect_uri,
  )}&response_type=code&scope=${encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.profile",
  )}`;

  return (
    <PageContainer>
      <LoginContainer>
        <LoginLogoImage src={CCPPLogo} />
        <LoginButton href={oauth_forty_two} src={FTLogo} type="42" />
        <br />
        <LoginButton href={oauth_google} src={GoogleLogo} type="Google" />
      </LoginContainer>
    </PageContainer>
  );
}
