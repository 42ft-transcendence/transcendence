import Loading from "@assets/images/loading.gif";
import { login } from "@src/api";
import { LoginResponseDataType, UserStatus } from "@src/types";
import { useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";

const AuthPage = () => {
  const type = useParams().type;
  const code = useSearchParams()[0].get("code");
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userDataState);

  useEffect(() => {
    // clear recoil data

    login(type as string, code as string)
      .then((response) => {
        // save user recoil data
        const responseData = response.data as LoginResponseDataType;
        console.log("Data", responseData);
        setUserData(response.data);

        if (response.data.isTwoFactorAuthenticationEnabled) {
          // open 2fa modal
        } else if (response.data.status === UserStatus.SIGNUP) {
          navigate("/signup");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          alert("잘못된 로그인 정보입니다.");
        } else if (error.response.status === 409) {
          alert("이미 로그인된 유저입니다.");
        } else {
          alert("unknown error");
        }
        navigate("/login");
      });
  }, [type, code, navigate]);

  if (!code || (type !== "42" && type !== "google"))
    return <Navigate to="/login" />;
  else
    return (
      <S.PageContainer>
        <S.LoadingImage src={Loading} alt="loading" />
      </S.PageContainer>
    );
};

export default AuthPage;
