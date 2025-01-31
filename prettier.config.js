/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "interface",
    "(?=content|api)",
    "context/",
    "mock/",
    "config",
    "utils/",
    "hooks/",
    "(components/|./index)",
    ".svg",
    "^../(.*)$",
    "(?=./styles.module.scss)",
  ],
  importOrderSeparation: true,
};
