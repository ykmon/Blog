// src/utils/content.ts - Content collection mapping helpers
import type { CollectionEntry } from 'astro:content';
import type { Article, GalleryPhoto, Tool } from '../data/content';
import { parseISODate } from './date';

export function articleHref(entry: CollectionEntry<'articles'>): string {
  return entry.data.href ?? `/articles/${entry.slug}/`;
}

export function toolHref(entry: CollectionEntry<'tools'>): string {
  return entry.data.href ?? `/tools/${entry.slug}/`;
}

export function mapArticleEntry(entry: CollectionEntry<'articles'>): Article {
  return {
    type: 'article',
    href: articleHref(entry),
    title: entry.data.title,
    category: entry.data.category,
    tags: entry.data.tags ?? [],
    description: entry.data.description,
    date: entry.data.date ?? '1970-01-01',
    readTime: entry.data.readTime,
    image: entry.data.image,
    imageAlt: entry.data.imageAlt,
    placeholder: entry.data.placeholder,
  };
}

export function mapToolEntry(entry: CollectionEntry<'tools'>): Tool {
  return {
    type: 'tool',
    href: toolHref(entry),
    icon: entry.data.icon ?? '⌘',
    title: entry.data.title,
    tags: entry.data.tags ?? [],
    description: entry.data.description,
    date: entry.data.date ?? '1970-01-01',
  };
}

export function mapGalleryEntry(entry: CollectionEntry<'gallery'>): GalleryPhoto {
  return {
    type: 'gallery',
    title: entry.data.title,
    category: entry.data.category,
    tags: entry.data.tags ?? [],
    description: entry.data.description,
    date: entry.data.date,
    location: entry.data.location,
    image: entry.data.image,
    imageAlt: entry.data.imageAlt,
  };
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => parseISODate(b.date) - parseISODate(a.date));
}

export function uniqueArticlesByTitle(articles: Article[]): Article[] {
  return articles.filter((article, index, arr) => {
    const key = article.title.trim().toLowerCase();
    return arr.findIndex((item) => item.title.trim().toLowerCase() === key) === index;
  });
}

export function countTags(items: Array<{ tags: string[] }>): Array<{ tag: string; count: number }> {
  const counts = items.reduce((acc, item) => {
    item.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'))
    .map(([tag, count]) => ({ tag, count }));
}

