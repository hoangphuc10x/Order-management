/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,tsx}",
    "./components/**/*.{js,jsx,tsx}",
    "./app/**/*.{js,jsx,tsx}",
    "./src/**/*.{js,jsx,tsx}",
    "./index.html",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true
  	},
  	extend: {
  		colors: {
  			// Tone chủ đạo: Tím → Hồng (rực rỡ, hiện đại)
  			// Gradient thương hiệu: from-primary-100 (tím) -> to-primary-400 (hồng)
  			primary: {
  				'100': '#7C3AED',
  				'200': '#8B5CF6',
  				'300': '#A855F7',
  				'400': '#EC4899',
  				'500': '#F0ABFC',
  				'600': '#6D28D9',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			// Ghi đè bảng "yellow" mặc định của Tailwind sang dải tím
  			// để toàn bộ class yellow-* cũ tự đổi theo tone mới.
  			yellow: {
  				'50': '#FAF5FF',
  				'100': '#F3E8FF',
  				'200': '#E9D5FF',
  				'300': '#D8B4FE',
  				'400': '#A855F7',
  				'500': '#7C3AED',
  				'600': '#6D28D9',
  				'700': '#5B21B6',
  				'800': '#4C1D95',
  				'900': '#3B0764'
  			},
  			secondary: {
  				'100': '#D9D9D9',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			text: {
  				'100': '#7C3AED',
  				'200': '#4F4F4F',
  				'300': '#828282',
  				'400': '#BDBDBD',
  				'500': '#E0E0E0',
  				'600': '#F2F2F2',
  				'700': '#F9F9F9',
  				'800': '#FFFFFF'
  			},
  			hover: '#E8E8E8',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			akaya: [
  				'Akaya Kanadaka',
  				'cursive'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
