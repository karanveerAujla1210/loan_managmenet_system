module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1741FF',
        'primary-dark': '#0F2ECC',
        'primary-light': '#E9EDFF',
        'light-gray': '#F7F8FA',
        'medium-gray': '#E5E7EB',
        'dark-gray': '#374151',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#0EA5E9'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem'
      },
      boxShadow: {
        'card-sm': '0 6px 18px rgba(23,65,255,0.06)',
        'card-md': '0 10px 30px rgba(2,6,23,0.08)'
      }
    }
  },
  plugins: []
}
