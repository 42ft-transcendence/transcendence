import { UserType } from "@src/types";
import * as S from "./index.styled";
import { useRecoilState } from "recoil";
import { showProfileState } from "@src/recoil/atoms/common";

export const HeaderCard = () => (
  <S.HeaderCard>
    <S.Rank style={{ marginLeft: "20px" }}>#</S.Rank>
    <S.ProfileImage style={{ opacity: 0 }} />
    <S.Nickname style={{ fontWeight: "bold" }}>닉네임</S.Nickname>
    <S.Tier style={{ fontSize: "18px" }}>점수</S.Tier>
    {/* <S.Record>승패</S.Record> */}
    <S.WinRate
      style={{
        width: "200px",
        textAlign: "center",
        marginRight: "10px",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      승률
    </S.WinRate>
  </S.HeaderCard>
);

const calculateWinRate = (wins: number, losses: number) => {
  const totalGames = wins + losses;
  if (totalGames === 0) return "0";
  return ((wins / totalGames) * 100).toFixed(2);
};

export const WinRateChart = ({ win, lose }: { win: number; lose: number }) => (
  <S.WinRateChart>
    <S.WinBar
      style={{
        width: `${calculateWinRate(win, lose)}%`,
      }}
    >
      <S.WinText>{win}</S.WinText>
    </S.WinBar>
    <S.LoseBar
      style={{
        width: `${100 - parseFloat(calculateWinRate(win, lose))}%`,
      }}
    >
      <S.LoseText>{lose}</S.LoseText>
    </S.LoseBar>
  </S.WinRateChart>
);

export const UserCard = ({
  user,
  index,
}: {
  user: UserType;
  index: number;
}) => {
  const [, setShowProfile] = useRecoilState(showProfileState);

  return (
    <S.UserCard key={user.id}>
      <S.Rank>{index + 1}</S.Rank>
      <S.ProfileImage src={user.avatarPath} alt={user.nickname} />
      <S.Nickname>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowProfile({
              showProfile: true,
              user: user,
            });
          }}
        >
          {user.nickname}
        </span>
      </S.Nickname>
      <S.Tier>{user.rating} LP</S.Tier>
      <S.WinRateContainer>
        <WinRateChart win={user.ladder_win} lose={user.ladder_lose} />
        <S.WinRate>
          {calculateWinRate(user.ladder_win, user.ladder_lose)}%
        </S.WinRate>
      </S.WinRateContainer>
    </S.UserCard>
  );
};
