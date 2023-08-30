import * as S from "./index.styled";

interface MatchCardProps {
  mode: string;
}

export const MatchCard = ({ mode }: MatchCardProps) => {
  return (
    <S.MatchCard mode={mode}>
      <S.MatchCardMatchInfo></S.MatchCardMatchInfo>
    </S.MatchCard>
  );
};
