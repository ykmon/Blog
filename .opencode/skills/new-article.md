# new-article

Create a new blog article with proper structure.

## Usage

```
/new-article <title> [options]
```

## Arguments

- `<title>` - Article title (required, use quotes if contains spaces)

## Options

- `--category <category>` - Article category (default: "Unreal Engine")
- `--tags <tags>` - Comma-separated tags (e.g., "UE,Code,Basic")
- `--description <desc>` - Article description
- `--date <date>` - Publication date in YYYY-MM-DD format (default: today)
- `--read-time <time>` - Estimated read time (e.g., "10 Min Read")
- `--image <path>` - Cover image path (e.g., "/Articles/my-article/cover.png")

## What This Skill Does

1. **Creates markdown content file** at `src/content/articles/<slug>.md`
2. **Creates Astro page file** at `src/pages/articles/<slug>.astro`
3. **Generates proper frontmatter** with all metadata

## Examples

```bash
# Basic usage
/new-article "Lumen源码分析"

# With all options
/new-article "Houdini Python自动化" --category "Houdini" --tags "Houdini,Code,Automation" --description "Houdini Python脚本开发指南" --read-time "15 Min Read"

# With image
/new-article "UE5 Niagara系统" --category "Unreal Engine" --tags "UE,VFX" --image "/Articles/niagara/cover.png"
```

## File Templates

### Markdown Content (`src/content/articles/<slug>.md`)

```markdown
---
title: "<title>"
description: "<description>"
category: "<category>"
date: "<date>"
readTime: "<readTime>"
tags:
  - <tag1>
  - <tag2>
image: "<image>"
---

<!-- Write your article content here -->
```

### Astro Page (`src/pages/articles/<slug>.astro`)

```astro
---
import { getEntryBySlug } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';

const entry = await getEntryBySlug('articles', '<slug>');
if (!entry) throw new Error('Missing article content: <slug>');
const { Content } = await entry.render();
---

<ArticleLayout
  title={entry.data.title}
  category={entry.data.category}
  description={entry.data.description}
  date={entry.data.date}
>
  <Content />
</ArticleLayout>
```

## Available Tags

Choose tags from these categories:

| Category | Available Tags |
|----------|----------------|
| Tools | UE, Unity, Houdini, Maya, Others DCC |
| Languages | Code |
| Domains | PCG, Animation, Automation, Simulation |
| Foundations | Basic |
| Practices | Plugin Development, DevOps |

## Notes

- Slug is auto-generated from title (lowercase, spaces to hyphens, remove special chars)
- If article belongs to a series, create it in a subdirectory like `src/content/articles/series-name/`
- After creation, run `npm run dev` to preview
