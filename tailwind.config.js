const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'background-lolz':
					'url(https://nztcdn.com/background/l/1709730905/944238.webp)',
			},
		},
	},
	plugins: [],
	darkMode: 'class',
	plugins: [nextui()],
}
