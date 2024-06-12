module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
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
        'dial-deep-purple': {
          DEFAULT: '#2e3192'
        },
        'dial-slate': {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b'
        },
        'dial-menu-hover': {
          DEFAULT: '#eceeef'
        },
        'dial-angel': {
          DEFAULT: '#c7ccf4'
        },
        'dial-white-linen': {
          DEFAULT: '#faf4ef'
        },
        // Use case color scheme
        'dial-cotton': {
          DEFAULT: '#f3f5ff'
        },
        'dial-blue-chalk': {
          DEFAULT: '#e6e9fc'
        },
        'dial-blueberry': {
          dark: '#4a4181',
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
        'dial-ethereal': {
          DEFAULT: '#f3fffb'
        },
        'dial-spearmint': {
          DEFAULT: '#e5fbf3'
        },
        'dial-meadow': {
          DEFAULT: '#106d38'
        },
        'product-bg': {
          DEFAULT: '#d8f3e9',
          light: '#f3fffb'
        },
        'dataset-bg': {
          light: '#ebeaf9',
          DEFAULT: '#d9d7f8'
        },
        'dial-acid': {
          DEFAULT: '#beeb1a'
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
          DEFAULT: '#c0fed7',
          dark: '#c0f69a'
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
        'sdg': {
          DEFAULT: '#7c5048'
        },
        'product': {
          DEFAULT: '#46465a'
        },
        'sdg-target': {
          DEFAULT: '#4b9f38'
        },
        'workflow': {
          light: '#85b8d6',
          DEFAULT: '#3e81a8'
        },
        'carousel': {
          DEFAULT: '#3f9edd',
          light: '#eef6fc'
        },
        'validation-error': {
          DEFAULT: '#e11d48'
        },
        'button-red': {
          DEFAULT: '#e11d48'
        }
      },
      maxWidth: {
        catalog: '120rem'
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      },
      fontFamily: {
        DEFAULT: '"Poppins", sans-serif'
      },
      screens: {
        '3xl': '1921px'
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
  ],
  // We are using the following classes for product comparison.
  // Make sure they're available after tailwind tree shaking.
  safelist: [
    'basis-1/4',
    'basis-1/5',
    'basis-1/6'
  ]
}
