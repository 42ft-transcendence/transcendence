import { Navigate, useLoaderData } from "react-router-dom";
import * as cookies from "react-cookies";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");
  const authorized = useLoaderData() as boolean;

  if (!jwt) {
    return <Navigate to="/login" />;
  } else if (!authorized) {
    alert("잘못된 로그인 정보입니다.");
    cookies.remove("jwt", { path: "/" });
    return <Navigate to="/login" />;
  } else {
    return children;
  }

  // 다른 조건도 여기에 추가할 수 있습니다. 예: userData.status 검사 등
  // if (cookies.load("jwt") === undefined) {
  //   // setShowLoginSuccessModal(false);
  //   console.log("isFirstLogin", isFirstLogin);
  //   return <Navigate to="/login" />;
  // } else if (userData.status === UserStatus.SIGNUP) {
  //   // setShowLoginSuccessModal(false);
  //   return <Navigate to="/signup" />;
  // }
};

export default PrivateRoute;
