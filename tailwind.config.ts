import { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js/ts/jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                libertinus: ['Libertinus Serif', 'serif'],
            },
        },
    },
    plugins: [],
};

export default config;