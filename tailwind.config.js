/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-surface-variant": "#5b403d",
        "on-secondary-fixed-variant": "#564500",
        "on-primary-fixed-variant": "#930010",
        "background": "#fbf9f8",
        "primary-fixed-dim": "#ffb3ac",
        "on-primary-container": "#ffd8d4",
        "on-tertiary-fixed": "#002115",
        "surface-dim": "#dcd9d9",
        "on-secondary-container": "#6f5900",
        "on-error": "#ffffff",
        "surface-variant": "#e4e2e1",
        "secondary-container": "#fed000",
        "on-background": "#1b1c1c",
        "primary-container": "#c21f24",
        "error-container": "#ffdad6",
        "error": "#ba1a1a",
        "primary-fixed": "#ffdad6",
        "surface-tint": "#ba1820",
        "outline-variant": "#e4beba",
        "on-tertiary-container": "#8ff5c8",
        "on-error-container": "#93000a",
        "on-tertiary": "#ffffff",
        "tertiary": "#00573d",
        "surface": "#fbf9f8",
        "surface-container-high": "#eae8e7",
        "secondary": "#725c00",
        "on-tertiary-fixed-variant": "#005139",
        "inverse-surface": "#303030",
        "on-surface": "#1b1c1c",
        "tertiary-fixed-dim": "#74daae",
        "on-primary-fixed": "#410003",
        "tertiary-container": "#007251",
        "surface-container-low": "#f6f3f2",
        "secondary-fixed-dim": "#edc200",
        "outline": "#906f6c",
        "tertiary-fixed": "#90f6c9",
        "secondary-fixed": "#ffe07f",
        "inverse-primary": "#ffb3ac",
        "on-secondary": "#ffffff",
        "surface-container": "#f0eded",
        "surface-container-highest": "#e4e2e1",
        "primary": "#9c0012",
        "surface-bright": "#fbf9f8",
        "inverse-on-surface": "#f3f0f0",
        "on-secondary-fixed": "#231b00",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "16px",
        "container-padding-mobile": "16px",
        "touch-target-min": "44px",
        "container-padding-desktop": "24px",
        "base-unit": "8px"
      },
      fontFamily: {
        "body-lg": ["Nunito"],
        "headline-md": ["Nunito"],
        "headline-lg": ["Nunito"],
        "body-md": ["Nunito"],
        "label-sm": ["Nunito"],
        "label-md": ["Nunito"],
        "headline-lg-mobile": ["Nunito"]
      },
      fontSize: {
        "body-lg": [
          "17px",
          {
            lineHeight: "24px",
            fontWeight: "400"
          }
        ],
        "headline-md": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600"
          }
        ],
        "headline-lg": [
          "30px",
          {
            lineHeight: "38px",
            letterSpacing: "-0.02em",
            fontWeight: "700"
          }
        ],
        "body-md": [
          "15px",
          {
            lineHeight: "22px",
            fontWeight: "400"
          }
        ],
        "label-sm": [
          "11px",
          {
            lineHeight: "16px",
            fontWeight: "500"
          }
        ],
        "label-md": [
          "13px",
          {
            lineHeight: "18px",
            fontWeight: "600"
          }
        ],
        "headline-lg-mobile": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.02em",
            fontWeight: "700"
          }
        ]
      }
    },
  },
  plugins: [],
}
