module.exports = {
  content: ['./src/**/*.{njk,md}'],
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#99d1db',
          'secondary': '#babbf1',
          'accent': '#f2d5cf',
          'neutral': '#232634',
          'base-100': '#303446',
          'base-200': '#292c3c',
          'base-300': '#232634',
          'info': '#8caaee',
          'success': '#a6d189',
          'warning': '#ef9f76',
          'error': '#ea999c'
        },
      },
    ],
  },
  theme: {
    fontFamily: {
      serif: [
        'Be Vietnam Pro',
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'Times', 'serif'
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