import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        snow: 'rgb(var(--color-snow) / <alpha-value>)',
        mist: 'rgb(var(--color-mist) / <alpha-value>)',
        ghost: 'rgb(var(--color-ghost) / <alpha-value>)',
        steel: 'rgb(var(--color-steel) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        obsidian: 'rgb(var(--color-obsidian) / <alpha-value>)',
        'white-pure': '#ffffff',
        void: {
          DEFAULT: 'rgb(var(--color-void) / <alpha-value>)',
          light: 'rgb(var(--color-void-light) / <alpha-value>)',
          lighter: 'rgb(var(--color-void-lighter) / <alpha-value>)',
        },
        hub: {
          orange: '#D97706',
          'orange-light': '#F59E0B',
          'orange-glow': '#D9770640',
        },
        giorgio: {
          purple: '#A855F7',
          'purple-dark': '#8B5CF6',
          'purple-light': '#C084FC',
          'purple-glow': '#A855F740',
        },
        cyber: {
          green: '#4ade80',
          'green-dark': '#22c55e',
          'green-glow': '#4ade8040',
          'green-dim': '#3cb371',
        },
        tactical: {
          amber: '#f59e0b',
          'amber-dark': '#d97706',
          'amber-glow': '#f59e0b40',
        },
        alert: {
          red: '#ef4444',
          'red-dark': '#dc2626',
          'red-glow': '#ef444440',
        },
        neutral: {
          850: '#1f1f23',
          950: '#0d0d0f',
        },
        light: {
          bg: '#f8fafc',
          'bg-secondary': '#e2e8f0',
          text: '#1e293b',
          'text-muted': '#64748b',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'scan-line': 'scanLine 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'typing': 'typing 3s steps(40, end)',
        'blink-caret': 'blinkCaret 0.75s step-end infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'terminal-glow': 'terminalGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blinkCaret: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#4ade80' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        terminalGlow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 222, 128, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(74, 222, 128, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.1) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
export default config
