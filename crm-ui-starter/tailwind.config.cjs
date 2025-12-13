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
        info: '#0EA5E9',
        'accent-purple': '#7C3AED',
        'accent-cyan': '#06B6D4',
        'accent-emerald': '#10B981'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-xl': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'card-sm': '0 6px 18px rgba(23,65,255,0.06)',
        'card-md': '0 10px 30px rgba(2,6,23,0.08)',
        'card-lg': '0 20px 40px rgba(2,6,23,0.1)',
        'glow-blue': '0 0 30px rgba(23,65,255,0.15)',
        'glow-purple': '0 0 30px rgba(124,58,237,0.15)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1741FF 0%, #0F2ECC 100%)',
        'gradient-accent': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #F7F8FA 0%, #E9EDFF 100%)',
      }
    }
  },
  plugins: []
}
