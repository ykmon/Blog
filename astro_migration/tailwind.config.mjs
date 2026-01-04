/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                paper: '#F5F5F7',
                ink: '#1a1a1a',
                forest: '#2d4a3e',
                ochre: '#8a6240',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                body: ['"Noto Serif SC"', 'serif'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.ink'),
                        '--tw-prose-headings': theme('colors.ink'),
                        fontFamily: theme('fontFamily.body'),
                        h1: { fontFamily: theme('fontFamily.serif') },
                        h2: {
                            fontFamily: theme('fontFamily.serif'),
                            color: theme('colors.forest'),
                            fontStyle: 'italic',
                        },
                        strong: { color: theme('colors.ochre') },
                        a: { color: theme('colors.ochre') },
                        blockquote: {
                            borderLeftColor: theme('colors.forest'),
                            fontStyle: 'italic',
                            backgroundColor: 'rgba(45, 74, 62, 0.05)',
                            color: theme('colors.gray.600'),
                        },
                        code: {
                            backgroundColor: '#f1f5f9',
                            color: '#b91c1c',
                            borderRadius: '0.25rem',
                            fontWeight: 'normal',
                        },
                        pre: {
                            backgroundColor: '#1e293b',
                        },
                    },
                },
            }),
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
