/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                paper: '#ffffff',
                ink: '#1a1a1a',
                forest: '#333333',
                ochre: '#555555',
                glass: 'rgba(255, 255, 255, 0.5)',
            },
            fontFamily: {
                serif: ['LXGW WenKai Lite', 'KaiTi', 'serif'],
                body: ['LXGW WenKai Lite', 'KaiTi', 'sans-serif'],
            },
            boxShadow: {
                'retro': 'none',
                'card': 'none',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.ink'),
                        '--tw-prose-headings': theme('colors.ink'),
                        fontFamily: theme('fontFamily.body').join(', '),
                        h1: { fontFamily: theme('fontFamily.serif').join(', ') },
                        h2: {
                            fontFamily: theme('fontFamily.serif').join(', '),
                            color: theme('colors.forest'),
                            fontStyle: 'normal',
                        },
                        h3: {
                            fontFamily: theme('fontFamily.serif').join(', '),
                            color: theme('colors.forest'),
                        },
                        strong: { color: theme('colors.ochre') },
                        a: { color: theme('colors.ochre') },
                        blockquote: {
                            borderLeftColor: theme('colors.forest'),
                            fontStyle: 'normal',
                            backgroundColor: '#fafafa',
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
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
