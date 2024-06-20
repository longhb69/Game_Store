/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        screens: {
            sm20: '20px',
            sm30: '30px',
            sm40: '40px',
            sm50: '50px',
            sm60: '60px',
            sm200: '200px',
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
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
