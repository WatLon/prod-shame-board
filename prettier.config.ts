import { type Config } from "prettier";

const config: Config = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  semi: true,
  bracketSpacing: true,
  arrowParens: "avoid",
  trailingComma: "all",
  bracketSameLine: false,
  printWidth: 100,
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};

export default config;
