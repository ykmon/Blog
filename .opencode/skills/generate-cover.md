# generate-cover

为博客文章批量生成手绘风格总结图并设为封面。

## Usage

```
/generate-cover [options]
```

## Options

- `--all` - 为所有无封面文章生成（默认行为）
- `--slug <slug>` - 只为指定文章生成（如 `gpu-execution-model`）
- `--force` - 强制重新生成（即使已有封面）

## What This Skill Does

1. **扫描文章** — 找出 `src/content/articles/` 中无 `image` 字段且非 `listed: false` 的文章
2. **读取内容** — 提取文章正文，截取前 1500 字符作为摘要
3. **调用 API 生成图片** — 通过 `gemini-3.1-flash-image` 模型生成手绘信息图
4. **保存图片** — 存放到 `Pictures/<slug>.jpg` 和 `public/Articles/<slug>/cover.jpg`
5. **更新文章** — 在 frontmatter 添加 `image` 字段，在正文最前面插入 `![cover](...)`

## Prerequisites

- Node.js >= 18
- 网络可访问 `https://api.duojie.games`
- API Key 配置在 `~/.claude/settings.json` 的 `env.DUOJIE_API_KEY`

## How It Works

### Step 1: 生成图片

运行已有脚本（支持断点续传）：

```bash
node scripts/generate-covers.mjs
```

脚本逻辑：
- 扫描所有 `.md` 文章，跳过已有 `image`、`listed: false`、内容 < 300 字符的
- 对每篇文章，将标题 + 正文摘要拼入提示词，调用 API 生成图片
- 图片保存到 `Pictures/<slug>.jpg`
- 进度记录在 `Pictures/.progress.json`，中断后重跑自动跳过已完成的

### Step 2: 更新文章 frontmatter 和正文

```bash
node scripts/update-covers.mjs
```

脚本逻辑：
- 扫描所有无 `image` 字段且非 `listed: false` 的文章
- 将 `Pictures/<slug>.jpg` 复制到 `public/Articles/<slug>/cover.jpg`
- 在 frontmatter 末尾添加 `image: "/Articles/<slug>/cover.jpg"`
- 在正文最前面插入 `![cover](/Articles/<slug>/cover.jpg)`

### Step 3: 提交

```bash
git add -A
git commit -m "feat: 为无封面文章生成手绘总结图并设为封面"
git push origin main
```

## Image Generation Prompt Template

```
[System / Prompt]

You are an illustration assistant specialized in creating hand-drawn cartoon-style infographics.

🎨 STYLE RULES:
- Pure hand-drawn illustration style (sketch lines, rough strokes, cartoon simplicity)
- No realism, no photorealistic shading, no 3D rendering
- Doodle / crayon / marker / pastel look
- Canvas format: landscape 16:9
- Minimal but expressive cartoon elements: small icons, symbols, cute characters

🧩 CONTENT RULES:
- Extract key ideas, summarize into short bullets (1–6 words each)
- Highlight keywords with hand-drawn emphasis: circles, underlines, arrows, stars, boxes
- Extensive whitespace, clean hand-drawn layout
- Title (center or top-left), 3–6 Key Points, Simple diagram or symbols
- All text hand-drawn, same language as content (Chinese)

🚫 RESTRICTIONS:
- No realistic imagery
- No essay-style text
- Keep meaningful whitespace

🖼️ TASK:
Create a cartoon-style hand-drawn infographic based on:

Title: {article.title}
Content: {article.body (truncated to 1500 chars)}
```

## API Details

- **Endpoint**: `https://api.duojie.games/v1/chat/completions`
- **Model**: `gemini-3.1-flash-image`
- **Method**: POST with OpenAI-compatible chat format
- **Response**: `choices[0].message.images[0].image_url.url` (base64 JPEG)
- **Rate**: ~30s per image, sequential processing with 2s delay between requests

## File Structure

```
Pictures/                          # 原始生成图片
  ├── <slug>.jpg                   # 每篇文章的总结图
  └── .progress.json               # 断点续传进度文件
public/Articles/<slug>/cover.jpg   # 部署用封面图（从 Pictures 复制）
scripts/
  ├── generate-covers.mjs          # 批量生成图片脚本
  └── update-covers.mjs            # 批量更新文章脚本
```

## Examples

```bash
# 为所有无封面文章生成总结图（完整流程）
node scripts/generate-covers.mjs
node scripts/update-covers.mjs

# 中断后继续（自动跳过已完成的）
node scripts/generate-covers.mjs

# 生成后检查
ls Pictures/*.jpg | wc -l
du -sh Pictures/
```

## Notes

- 每张图约 600KB-1MB，63 篇约 50MB
- 脚本支持断点续传，中断后重跑不会重复生成
- `listed: false` 的系列子文章不会生成封面（通过系列页面访问）
- 内容少于 300 字符的文章会被跳过
- 生成完成后建议 `npm run build` 验证构建无误
