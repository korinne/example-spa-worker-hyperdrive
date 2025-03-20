/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-serif': ['"Noto Serif"', 'serif'],
        'noto-sans': ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        paper: '#fafafa', // Off-white background
        card: '#ffffff',  // White for cards
        text: {
          primary: '#222222',   // Near-black for main text
          secondary: '#4a4a4a', // Dark gray for secondary text
          muted: '#717171',     // Muted text
        },
        accent: {
          light: '#e6edf8',      // Light accent for backgrounds
          default: '#486284',    // Muted blue accent
          hover: '#36486b',      // Darker on hover
          gold: '#c9aa71',       // Gold accent for highlights
          goldHover: '#b69860',  // Darker gold for hover
        },
        border: {
          light: '#eaeaea',      // Light border color
          default: '#d1d1d1',    // Default border color
          dark: '#9e9e9e',       // Dark border
        },
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.05)',
        lg: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        none: 'none',
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
      },
      spacing: {
        'sidebar': '280px',
      },
    },
  },
  plugins: [
    // Since we can't use require in ESM, we need to handle line-clamp directly
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}