import { Navigate } from "react-router-dom";
import * as cookies from "react-cookies";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const jwt = cookies.load("jwt");

  if (!jwt) {
    return <Navigate to="/login" />;
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
  return children;
};

export default PrivateRoute;
