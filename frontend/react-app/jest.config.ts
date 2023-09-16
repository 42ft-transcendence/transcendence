import { resolve } from "path";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/node_modules/@testing-library/jest-dom"],
  moduleNameMapper: {
    "^@src/(.*)$": resolve(__dirname, "./src/$1"),
    "^@api/(.*)$": resolve(__dirname, "./src/api/$1"),
    "^@assets/(.*)$": resolve(__dirname, "./src/assets/$1"),
    "^@components/(.*)$": resolve(__dirname, "./src/components/$1"),
    "^@hooks/(.*)$": resolve(__dirname, "./src/hooks/$1"),
    "^@mocks/(.*)$": resolve(__dirname, "./src/mocks/$1"),
    "^@pages/(.*)$": resolve(__dirname, "./src/pages/$1"),
    "^@router/(.*)$": resolve(__dirname, "./src/router/$1"),
    "^@recoil/(.*)$": resolve(__dirname, "./src/recoil/$1"),
    "^@type/(.*)$": resolve(__dirname, "./src/types/$1"),
    "^@utils/(.*)$": resolve(__dirname, "./src/utils/$1"),
    "^@test/(.*)$": resolve(__dirname, "./src/__test__/$1"),
    "^@styles/(.*)$": resolve(__dirname, "./src/styles/$1"),
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
    "^.+\\.svg$": "<rootDir>/svgTransform.ts",
    "^.+\\.gif$": "<rootDir>/svgTransform.ts",
    "^.+\\.png$": "<rootDir>/svgTransform.ts",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  silent: false,
};
