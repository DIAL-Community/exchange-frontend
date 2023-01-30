module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        3: '3px'
      },
      colors: {
        // Part of the UX refresh.
        'dial-sapphire': {
          DEFAULT: '#2e3192'
        },
        'dial-white-beech': {
          DEFAULT: '#faf4ef'
        },
        'dial-gray': {
          light: '#f5f6fa',
          DEFAULT: '#dfdfea',
          dark: '#46465a'
        },
        'button-gray': {
          light: '#9899b4',
          DEFAULT: '#323245'
        },
        'dial-yellow': {
          DEFAULT: '#faab19',
          light: '#feeed1'
        },
        'dial-teal': {
          light: '#3e81a8',
          DEFAULT: '#3F9EDD'
        },
        'dial-blue': {
          light: '#b2daf5',
          DEFAULT: '#3F9EDD',
          darkest: '#000043'
        },
        'dial-purple': {
          DEFAULT: '#323245',
          light: '#636374'
        },
        'dial-cyan': {
          DEFAULT: '#2fd1c5'
        },
        'dial-violet': {
          DEFAULT: '#613970'
        },
        'dial-not-active': {
          DEFAULT: '#647883'
        },
        'use-case': {
          DEFAULT: '#613970'
        },
        'building-block': {
          DEFAULT: '#647883'
        },
        sdg: {
          DEFAULT: '#7c5048'
        },
        product: {
          DEFAULT: '#46465a'
        },
        'sdg-target': {
          DEFAULT: '#4b9f38'
        },
        workflow: {
          light: '#85b8d6',
          DEFAULT: '#3e81a8'
        },
        carousel: {
          DEFAULT: '#3f9edd',
          light: '#eef6fc'
        },
        'dial-orange': {
          DEFAULT: '',
          light: '#ffc862'
        },
        'dial-hero-graphic': {
          light: '#f5f6fa',
          dark: '#646375'
        },
        'validation-error': {
          DEFAULT: '#e11d48'
        },
        'button-red': {
          DEFAULT: '#e11d48'
        },
      },
      fontSize: {
        'landing-title': ['66px', {
          lineHeight: '76px'
        }]
      },
      lineHeight: {
        landing: '2.625rem'
      },
      maxWidth: {
        '1/3': '33.33%',
        '2/3': '66.67%',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        catalog: '2120px'
      },
      maxHeight: {
        lg: '28rem',
        xl: '32rem'

      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      },
      inset: {
        // This should be set to the value of our top bar height.
        '66px': '66px'
      },
      fontFamily: {
        DEFAULT: '"Poppins", sans-serif'
      }
    }
  },
  variants: {
    extend: {
      margin: ['last'],
      borderWidth: ['hover'],
      opacity: ['disabled'],
      fontWeight: ['hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp')
  ]
}
