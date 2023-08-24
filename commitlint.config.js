module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "Feat",
        "Fix",
        "Design",
        "Style",
        "Refactor",
        "Test",
        "Chore",
        "Comment",
        "Rename",
        "Remove",
      ],
    ],
    "header-max-length": [2, "always", 50],
    "references-empty": [2, "never"],
  },
};
