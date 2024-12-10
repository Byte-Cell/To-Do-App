/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';

export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];

export const theme = {
  extend: {},
};

export const plugins = [scrollbar];
