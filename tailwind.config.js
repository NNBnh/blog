module.exports = {
  content: ['./src/**/*.{njk,md}'],
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#99d1db',
          'primary-content': '#004955',
          'secondary': '#babbf1',
          'secondary-content': '#000262',
          'accent': '#f2d5cf',
          'accent-content': '#601707',
          'neutral': '#232634',
          'neutral-content': '#c6d0f5',
          'base-100': '#303446',
          'base-200': '#292c3c',
          'base-300': '#232634',
          'base-content': '#c6d0f5',
          'info': '#8caaee',
          'success': '#a6d189',
          'warning': '#ef9f76',
          'error': '#ea999c',
        },
      },
    ],
  },
  theme: {
    fontFamily: {
      serif: [
        'Be Vietnam Pro',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"'
      ],
      mono: [
        'JetBrains Mono',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace'
      ]
    }
  }
};
