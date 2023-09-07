import Loading from "@assets/images/loading.gif";
import { JoinedDmOtherType, UserStatus } from "@src/types";
import { login, verify2Fa } from "@src/api";
import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import * as S from "./index.styled";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import * as cookies from "react-cookies";
import Logo from "@assets/logos/ccpp_logo.png";
import { getMyChannels } from "@src/api/participants";
import { joinedChannelListState } from "@src/recoil/atoms/channel";
import { joinedDmOtherListState } from "@src/recoil/atoms/directMessage";
import { getDM } from "@src/api/dm";

const AuthPage = () => {
  const type = useParams().type;
  const code = useSearchParams()[0].get("code");
  const [status, setStatus] = useState<
    "Loading" | "TwoFactor" | "TwoFactorLoading"
  >("Loading");
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userDataState);
  const inputRef = useRef<HTMLInputElement>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);

  const handleTwoFactorCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newCode = event.target.value;
    for (let i = 0; i < newCode.length; i++) {
      if (newCode[i] < "0" || newCode[i] > "9") {
        return;
      }
    }
    if (newCode.length > 6) {
      return;
    }
    setTwoFactorCode(newCode);
  };

  useEffect(() => {
    if (twoFactorCode.length === 6) {
      setStatus("TwoFactorLoading");
    }
  }, [twoFactorCode]);

  const handleTwoFactorCancel = () => {
    cookies.remove("jwt", { path: "/" });
    navigate("/login");
  };

  const loadMyData = (myId: string) => {
    getMyChannels()
      .then((response) => {
        setJoinedChannelList(
          response.data.map((channel) => {
            return { ...channel, hasNewMessages: false };
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
    getDM()
      .then((response) => {
        const dmOthers: JoinedDmOtherType[] = [];
        response.data.forEach((dm) => {
          if (dm.from.id === myId) {
            if (!dmOthers.find((dmOther) => dmOther.id === dm.to.id)) {
              dmOthers.push({ ...dm.to, hasNewMessages: false });
            }
          } else {
            if (!dmOthers.find((dmOther) => dmOther.id === dm.from.id)) {
              dmOthers.push({ ...dm.from, hasNewMessages: false });
            }
          }
        });
        setJoinedDmOtherList(dmOthers);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (status === "TwoFactor") {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    // clear recoil data

    if (status === "Loading") {
      login(type as string, code as string)
        .then((response) => {
          // save user recoil data
          setUserData(response.data);
          loadMyData(response.data.id);
          if (response.data.isTwoFactorAuthenticationEnabled) {
            setStatus("TwoFactor");
          } else if (response.data.status === UserStatus.SIGNUP) {
            navigate("/signup");
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            alert("잘못된 로그인 정보입니다.");
          } else if (error.response.status === 409) {
            alert("이미 로그인된 유저입니다.");
          } else {
            console.error(error);
          }
          navigate("/login");
        });
    } else if (status === "TwoFactorLoading") {
      verify2Fa(twoFactorCode)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            alert("잘못된 인증 코드입니다.");
            setTwoFactorCode("");
            setStatus("TwoFactor");
          } else {
            console.error(error);
          }
        });
    }
  }, [status, setStatus, type, code, navigate, twoFactorCode, setUserData]);

  if (!code || (type !== "42" && type !== "google"))
    return <Navigate to="/login" />;
  else
    return (
      <S.Container>
        <img src={Logo} alt="logo" width={300} height={300} />
        {status === "Loading" ? (
          <S.LoadingImage src={Loading} alt="loading" />
        ) : (
          <>
            <S.TwoFactorTitle>2차 인증</S.TwoFactorTitle>
            <S.TwoFactorInput
              type="test"
              disabled={status === "TwoFactorLoading"}
              ref={inputRef}
              value={twoFactorCode}
              onChange={handleTwoFactorCodeChange}
            />
            {/* <IconButton title="취소" /> */}
            <button style={{ color: "#FFF" }} onClick={handleTwoFactorCancel}>
              취소
            </button>
          </>
        )}
      </S.Container>
    );
};

export default AuthPage;
