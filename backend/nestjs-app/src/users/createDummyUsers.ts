import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';

interface DummyUser {
  id: string;
  nickname: string;
  win: number;
  lose: number;
  ladder_win: number;
  ladder_lose: number;
  admin: boolean;
  avatarPath: string;
  status: number;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
  rating: number;
  channels: ChatChannel[];
}

const K = 32;

const expectedScore = (
  ratingA: number,
  ratingB = Math.floor(Math.random() * 1000) + 1200,
): number => 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));

const updateRating = (
  rating: number,
  expected: number,
  actual: number,
): number => rating + K * (actual - expected);

const calculateRating = (
  initialRating: number,
  wins: number,
  loses: number,
): number => {
  let rating = initialRating;

  for (let i = 0; i < wins; i++) {
    const expected = expectedScore(rating);
    rating = updateRating(rating, expected, 1);
  }

  for (let i = 0; i < loses; i++) {
    const expected = expectedScore(rating);
    rating = updateRating(rating, expected, 0);
  }

  return rating;
};

export const createDummyUsers = (num: number): DummyUser[] => {
  return Array.from({ length: num }, (_, index): DummyUser => {
    const id = `DUMMY-${(index + 1).toString().padStart(6, '0')}`;
    const nickname = `dummy${index + 1}` + `${index < 3 ? ' (admin)' : ''}`;
    const win = Math.floor(Math.random() * 201);
    const lose = Math.floor(Math.random() * 201);
    const ladder_win = Math.floor(Math.random() * 201);
    const ladder_lose = Math.floor(Math.random() * 201);
    const rating = Math.floor(calculateRating(1000, ladder_win, ladder_lose));
    const status = Math.floor(Math.random() * 3); // 랜덤하게 0, 1, 2 중 하나를 선택

    return {
      id,
      nickname,
      win,
      lose,
      ladder_win,
      ladder_lose,
      admin: index < 3 ? true : false,
      avatarPath: `http://dev.ccpp.games/files/profiles/profile${
        (index + 1) % 5
      }.png`,
      status,
      twoFactorAuthenticationSecret: '',
      isTwoFactorAuthenticationEnabled: false,
      rating,
      channels: [],
    };
  });
};
