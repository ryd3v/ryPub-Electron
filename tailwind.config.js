/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'black': '#18181b',
                'white': '#e4e4e7'
            },
        },
    },
    plugins: [],
}
