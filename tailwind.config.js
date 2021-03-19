module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      dialgray: {
        light: '#f5f6fa',
        DEFAULT: '#dfdfea',
        dark: '#46465a'
      },
      buttongray: {
        light: '#9899b4',
        DEFAULT: '#323345'
      },
      dialyellow: {
        DEFAULT: '#fab230'
      },
      dialteal: {
        DEFAULT: '#3F9EDD'
      },
      dialblue: {
        DEFAULT: '#3F9EDD',
        darkest: '#000043'
      }
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
