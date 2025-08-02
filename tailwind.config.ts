import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Sacred Deepam ceremony colors
				flame: {
					gold: 'hsl(var(--flame-gold))',
					orange: 'hsl(var(--flame-orange))',
					red: 'hsl(var(--flame-red))'
				},
				brass: 'hsl(var(--brass))',
				'mystical-blue': 'hsl(var(--mystical-blue))',
				'sacred-glow': 'hsl(var(--sacred-glow))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'flame-gradient': 'var(--gradient-flame)',
				'mystical-gradient': 'var(--gradient-mystical)',
				'brass-gradient': 'var(--gradient-brass)'
			},
			boxShadow: {
				'flame': 'var(--shadow-flame)',
				'sacred': 'var(--shadow-sacred)',
				'deepam-glow': 'var(--glow-deepam)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'flame-flicker': {
					'0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
					'25%': { transform: 'scale(1.05) rotate(1deg)', opacity: '0.9' },
					'50%': { transform: 'scale(0.98) rotate(-1deg)', opacity: '0.95' },
					'75%': { transform: 'scale(1.03) rotate(0.5deg)', opacity: '0.9' }
				},
				'flame-rise': {
					'0%': { transform: 'translateY(0px) scale(1)', opacity: '1' },
					'100%': { transform: 'translateY(-20px) scale(1.1)', opacity: '0' }
				},
				'sacred-glow': {
					'0%, 100%': { boxShadow: 'var(--glow-deepam)' },
					'50%': { boxShadow: '0 0 80px hsl(var(--sacred-glow) / 0.6)' }
				},
				'blessing-appear': {
					'0%': { transform: 'translateY(20px) scale(0.9)', opacity: '0' },
					'100%': { transform: 'translateY(0px) scale(1)', opacity: '1' }
				},
				'deepam-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flame-flicker': 'flame-flicker 2s ease-in-out infinite',
				'flame-rise': 'flame-rise 1s ease-out infinite',
				'sacred-glow': 'sacred-glow 3s ease-in-out infinite',
				'blessing-appear': 'blessing-appear 1s ease-out forwards',
				'deepam-float': 'deepam-float 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
