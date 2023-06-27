module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      borderWidth: {
        3: '3px'
      },
      colors: {
        'dial-sapphire': {
          DEFAULT: '#2e3192'
        },
        'dial-stratos': {
          DEFAULT: '#000542'
        },
        'dial-iris-blue': {
          DEFAULT: '#485cd5'
        },
        'dial-slate': {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#ccd5e1',
          400: '#95a4b7',
          500: '#65758a',
          600: '#485668'
        },
        'dial-menu-hover': {
          DEFAULT: '#eceeef'
        },
        'dial-angel': {
          DEFAULT: '#c7ccf4'
        },
        // Use case color scheme
        'dial-cotton': {
          DEFAULT: '#f3f5ff'
        },
        'dial-blue-chalk': {
          DEFAULT: '#e6e9fc'
        },
        'dial-blueberry': {
          DEFAULT: '#574f8a'
        },
        // Workflow color scheme
        'dial-plum': {
          DEFAULT: '#712a9b'
        },
        'dial-violet': {
          light: '#ecebf9',
          DEFAULT: '#d9d7f8'
        },
        'workflow-bg': {
          light: '#ebeaf9',
          DEFAULT: '#d9d7f8'
        },
        // Building block color scheme
        'dial-warm-beech': {
          DEFAULT: '#fff0e3'
        },
        'dial-orange': {
          DEFAULT: '#ff8700'
        },
        'dial-ochre': {
          DEFAULT: '#8a4900'
        },
        'building-block-bg': {
          light: '#fff0e3',
          DEFAULT: '#ffe7c8'
        },
        // Product color scheme
        'ethereal': {
          DEFAULT: '#f3fffb'
        },
        'spearmint': {
          DEFAULT: '#e5fbf3'
        },
        'meadow': {
          DEFAULT: '#106d38'
        },
        'product-bg': {
          DEFAULT: '#d8f3e9',
          light: '#f3fffb'
        },
        // Part of the UX refresh.
        'govstack-blue': {
          DEFAULT: '#0539e3',
          light: '#007aff'
        },
        'dial-christmas': {
          DEFAULT: '#00873e'
        },
        'dial-white-beech': {
          light: '#e2e8f0',
          DEFAULT: '#faf4ef'
        },
        'dial-sunshine': {
          DEFAULT: '#faa92b'
        },
        'dial-alice-blue': {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9'
        },
        'dial-solitude': {
          DEFAULT: '#e2e8f0'
        },
        'dial-eggshell': {
          DEFAULT: '#faeedc'
        },
        'dial-mint': {
          DEFAULT: '#c0fed7'
        },
        'dial-ice': {
          DEFAULT: '#d4ffef'
        },
        'dial-lavender': {
          DEFAULT: '#96a2ef'
        },
        'dial-amethyst-smoke': {
          DEFAULT: '#9996ef'
        },
        'dial-biscotti': {
          DEFAULT: '#fad3a2'
        },
        'footer-delimiter': {
          DEFAULT: '#c7cefa'
        },
        // End of UX refresh colors
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
    require('@tailwindcss/forms')
  ]
}
