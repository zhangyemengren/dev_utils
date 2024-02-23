import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            layout: {
                fontSize: {
                    tiny: "0.75rem", // text-tiny
                    small: "1rem", // text-small
                    medium: "1.25rem", // text-medium
                    large: "1.875rem", // text-large
                },
            },
        }),
    ],
};
