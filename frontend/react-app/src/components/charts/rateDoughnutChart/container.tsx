import {
  Chart,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Theme } from "@src/styles/Theme";
import * as S from "./index.styled";

Chart.register(ArcElement, DoughnutController, Title, Tooltip, Legend, Filler);

type isRankingType = 1 | 2;

interface ProfileWinRateDoughnutProps {
  wins: number;
  losses: number;
  rating: number;
  isRanking: isRankingType;
}

interface ProfileRatingEachProps {
  src: string;
  text: string;
  color: string;
}

const ProfileWinRateImgTextBox: React.FC<ProfileRatingEachProps> = ({
  src,
  text,
  color,
}) => {
  return (
    <>
      <S.RatingEachImgContainer src={src} />
      <S.RatingEachTextContainer color={color}>
        {text}
      </S.RatingEachTextContainer>
    </>
  );
};

export const ProfileWinRateDoughnut: React.FC<ProfileWinRateDoughnutProps> = ({
  wins,
  losses,
  rating,
  isRanking,
}) => {
  const totalGames = wins + losses;
  const winRate = totalGames === 0 ? 50 : (wins / totalGames) * 100;
  const data = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [wins === 0 ? 0.000001 : wins, losses === 0 ? 0.000001 : losses],
        backgroundColor: [Theme.colors.win, Theme.colors.lose],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutoutPercentage: 70,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const winRateTextBoxData = [
    {
      src: "../src/assets/icons/ranking.svg",
      text: `${isRanking === 1 ? rating : "일반전"}`,
      color: Theme.colors.gold,
    },
    {
      src: "../src/assets/icons/win.svg",
      text: `${wins} 승`,
      color: Theme.colors.win,
    },
    {
      src: "../src/assets/icons/lose.svg",
      text: `${losses} 패`,
      color: Theme.colors.lose,
    },
  ];

  return (
    <S.RatingContainer>
      <S.RatingTextContainer>
        {winRateTextBoxData.map((data, index) => (
          <ProfileWinRateImgTextBox
            key={index}
            src={data.src}
            text={data.text}
            color={data.color}
          />
        ))}
      </S.RatingTextContainer>
      <S.DoughnutContainer>
        <Doughnut data={data} options={options as any} />
        <S.DoughnutText>
          <>승률</>
          <br />
          <>{winRate.toFixed(1)}%</>
        </S.DoughnutText>
      </S.DoughnutContainer>
    </S.RatingContainer>
  );
};
