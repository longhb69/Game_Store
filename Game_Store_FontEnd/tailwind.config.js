/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                dark: '#121212',
                'text-color': '#dbe2e6',
                'light-blue-background': '#93b3c8',
                'text-on-light-blue': '#D1D1D1',
                'section-title-color': '#a3a3a3',
            },
            fontFamily: {
                Brutal: ['Brutal', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
}
