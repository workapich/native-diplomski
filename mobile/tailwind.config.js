/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crvena: {
          primary: "#E53E3E",
          secondary: "#C53030",
        },
        plava: {
          primary: "#3B82F6",
          secondary: "#1D4ED8",
        },
        zuta: {
          primary: "#FDE047",
          secondary: "#FACC15",
        },
        zelena: {
          primary: "#10B981",
          secondary: "#059669",
        },
        ljubicasta: {
          primary: "#5c0e78",
          secondary: "#a940cf",
        },
        bela: {
          primary: "#ffffff",
          secondary: "#d1d1d1",
        },
        braon: {
          primary: "#6e321e",
          secondary: "#874c39",
        },
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#006466",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  safelist: [
    "border-zuta-primary",
    "bg-zuta-secondary",
    "border-crvena-primary",
    "bg-crvena-secondary",
    "border-plava-primary",
    "bg-plava-secondary",
    "border-zelena-primary",
    "bg-zelena-secondary",
    "bg-plava-secondary",
    "border-ljubicasta-primary",
    "bg-ljubicasta-secondary",
    "border-bela-primary",
    "bg-bela-secondary",
    "border-braon-primary",
    "bg-braon-secondary",
    // add other dynamic classes you expect
  ],
  plugins: [],
};
