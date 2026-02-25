# new-tool

Create a new Houdini tool documentation entry.

## Usage

```
/new-tool <title> [options]
```

## Arguments

- `<title>` - Tool title (required, use quotes if contains spaces)

## Options

- `--icon <icon>` - Tool icon (emoji or symbol, default: "🔧")
- `--description <desc>` - Tool description (short summary)
- `--tags <tags>` - Comma-separated tags (default: "Houdini,Code")

## What This Skill Does

1. **Creates markdown content file** at `src/content/tools/<slug>.md`
2. **Adds metadata entry** to `src/data/content.ts` in the `tools[]` array
3. **No page file needed** - uses dynamic routing via `[...slug].astro`

## Examples

```bash
# Basic usage
/new-tool "批量重命名节点"

# With icon and description
/new-tool "自动创建LOD" --icon "📐" --description "Automatic LOD generation tool"

# With custom tags
/new-tool "UE场景导出器" --icon "🎮" --tags "UE,Code,Automation" --description "Export UE scenes to Houdini"
```

## File Templates

### Markdown Content (`src/content/tools/<slug>.md`)

```markdown
---
title: "<title>"
description: "<description>"
category: "Houdini / Tool"
---

<!-- Describe what the tool does -->

## Usage

<!-- How to use the tool -->

## Code

\`\`\`python
# Your Python code here
\`\`\`
```

### Metadata Entry (add to `src/data/content.ts`)

```typescript
{
    type: 'tool',
    href: '/tools/<slug>/',
    icon: '<icon>',
    title: '<title>',
    tags: ['<tag1>', '<tag2>'],
    description: '<description>',
    date: '<today>'
},
```

## Available Icons

Common emoji icons for tools:
- 🔧 Tool / General
- ⚡ Quick / Fast
- 📐 Geometry / Math
- 🔗 Connection / Link
- ✂️ Split / Cut
- 🔢 Count / Number
- 📝 Text / Name
- 🎮 Unreal Engine
- 🎬 Animation
- 🎨 Art / Design

## Notes

- Slug is auto-generated from title (lowercase, spaces to hyphens, remove special chars)
- The tool page is automatically routed via `src/pages/tools/[...slug].astro`
- Always add the metadata entry to `content.ts`, otherwise the tool won't appear in listings
- After creation, run `npm run dev` to preview
