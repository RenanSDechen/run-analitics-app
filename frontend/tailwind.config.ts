import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    // --- CORREÇÃO AQUI ---
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Corrigido de 'srcs' para 'src'
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Cor de Marca (Brand) ---
        'primary': '#20df6c',
        'lp-primary': '#06f967',

        // --- Cores Neutras (A Nova Base) ---
        'background-light': '#ffffff',
        'background-dark': colors.zinc[950], // '#18181b'
        'lp-bg-dark': colors.zinc[950],

        // --- Mapeamento da UI ---
        'card-bg': colors.zinc[900],
        'card-border': colors.zinc[800],
        'card-text-light': colors.zinc[400],
        'form-bg': colors.zinc[900],
        'form-border': colors.zinc[700],
        'form-placeholder': colors.zinc[400],
        'form-text': colors.zinc[100],
        
        // --- Cor do Texto do Botão (NOVA) ---
        // Usada para o texto sobre o 'bg-primary'
        'text-on-primary': colors.zinc[950], // '#18181b'

        // Componentes (Step 2)
        'progress-bar-bg': colors.zinc[800],
        'radio-group-bg': colors.zinc[800],
        'radio-group-text': colors.zinc[400],
        'radio-group-selected-bg': colors.zinc[950],
        'button-secondary-bg': colors.zinc[800],
        'button-secondary-hover': colors.zinc[700],
      },
      fontFamily: {
        display: ['var(--font-lexend)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
  ],
}
export default config