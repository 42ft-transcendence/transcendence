import { UserType } from "@src/types";

export const initialUserData = {
  id: "0",
  nickname: "guest",
  win: 0,
  lose: 0,
  ladder_win: 0,
  ladder_lose: 0,
  admin: false,
  avatarPath: "",
  status: 0,
  twoFactorAuthenticationSecret: "",
  isTwoFactorAuthenticationEnabled: false,
  rating: 1000,
};

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

export const createDummyUsers = (num: number): UserType[] => {
  return Array.from({ length: num }, (_, index): UserType => {
    const id = `42-${(index + 1).toString().padStart(6, "0")}`;
    const nickname = `user${index + 1}`;
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
      admin: false,
      avatarPath: `${process.env.VITE_BASE_URL}/files/profiles/profile${
        (index + 1) % 5
      }.png`,
      status,
      twoFactorAuthenticationSecret: "",
      isTwoFactorAuthenticationEnabled: false,
      rating,
    };
  });
};
