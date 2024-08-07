import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "c-blue": "#0A61A6",
        "c-gray": "#5C5D64",
        "c-golden": "#D1AF65",
        "c-light-blue": "#C7D3E6",
        "c-light-golden": "#E7CA85",
      },
      fontSize: {
        "2sm": "12px",
      },
    },
  },
  plugins: [],
};
export default config;
