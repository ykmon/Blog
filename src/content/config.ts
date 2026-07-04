import { defineCollection, z } from 'astro:content';
import { allTags } from '../data/tags';

const tagSchema = z.enum(allTags as [string, ...string[]]);

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    href: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(tagSchema).optional(),
    readTime: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    placeholder: z.string().optional(),
    listed: z.boolean().optional(),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('Houdini / Tool'),
    tags: z.array(tagSchema).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    icon: z.string().optional(),
    date: z.string().optional(),
    href: z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string(),
    date: z.string(),
    location: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string(),
    imageAlt: z.string(),
    listed: z.boolean().optional(),
  }),
});

export const collections = {
  articles,
  tools,
  gallery,
};
