module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      dialgray: {
        light: '#f5f6fa',
        DEFAULT: '#dfdfea',
        dark: '#46465a',
        darkest: '#000043'
      },
      dialyellow: {
        DEFAULT: '#fab230'
      }
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
