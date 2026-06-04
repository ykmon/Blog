// src/data/tags.ts - Shared content tag taxonomy

export const tagCategories = {
  tools: ['UE', 'UE5', 'UnrealEngine', 'Unity', 'Houdini', 'Maya', 'Others DCC'],
  languages: ['Code'],
  domains: ['Shader', 'ComputeShader', 'PCG', 'Animation', 'Automation', 'Simulation'],
  foundations: ['Basic'],
  practices: ['Plugin Development', 'Plugin', 'RDG', 'DevOps', 'AI'],
} as const;

export const allTags = Object.values(tagCategories).flat();

export type ContentTag = (typeof allTags)[number];

export function getTagCategory(tag: string): keyof typeof tagCategories | null {
  for (const [category, tags] of Object.entries(tagCategories)) {
    if ((tags as readonly string[]).includes(tag)) {
      return category as keyof typeof tagCategories;
    }
  }
  return null;
}

