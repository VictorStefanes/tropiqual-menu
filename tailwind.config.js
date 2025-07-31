/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta oficial Tropiqual
        tropiqual: {
          gold: '#D4AF37',      // Dourado elegante (principal)
          darkGold: '#B8941F',  // Dourado escuro
          lightGold: '#F4E4A6', // Dourado claro
          cream: '#F5F1E8',     // Creme suave
          bronze: '#CD7F32',    // Bronze
        },
        // Tons neutros elegantes da marca (versão clara)
        elegant: {
          white: '#FFFFFF',     // Branco puro (fundo principal)
          lightGray: '#F8F9FA', // Cinza muito claro (fundo secundário)
          cream: '#F5F1E8',     // Creme suave (cards)
          mediumGray: '#6C757D', // Cinza médio (textos secundários)
          darkGray: '#343A40',  // Cinza escuro (textos principais)
          black: '#212529',     // Preto suave (textos importantes)
        },
        // Paleta para tema escuro
        dark: {
          bg: '#0F0F0F',        // Fundo escuro principal
          surface: '#1A1A1A',   // Superfícies
          card: '#252525',      // Cards
          border: '#333333',    // Bordas
          text: '#FFFFFF',      // Texto principal
          'text-secondary': '#CCCCCC', // Texto secundário
          'text-muted': '#999999',     // Texto esmaecido
        },
        // Cores de destaque da marca
        accent: {
          red: '#8B0000',       // Vermelho profundo (para picante)
          green: '#2D5016',     // Verde escuro (para vegetariano)
          blue: '#1E3A8A',      // Azul profundo (para sem glúten)
        },
        // Mantendo compatibilidade
        primary: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#D4AF37',  // Dourado principal
          500: '#B8941F',  // Dourado escuro
          600: '#92400e',
          700: '#78350f',
          800: '#451a03',
          900: '#1c0a00',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#F8F9FA',  // Cinza claro para modo claro
          900: '#FFFFFF',  // Branco para fundo principal
        }
      },
      fontFamily: {
        'japanese': ['Noto Sans JP', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tropiqual-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8941F 50%, #CD7F32 100%)',
        'elegant-dark': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #F5F1E8 100%)',
      },
    },
  },
  plugins: [],
}
