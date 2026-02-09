import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    href: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    placeholder: z.string().optional(),
    listed: z.boolean().optional(),
  }),
});

export const collections = {
  articles,
};
