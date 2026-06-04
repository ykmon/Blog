# Resource Audit

This project keeps article media under `public/Articles` and `public/images`.
The current maintenance priority is to identify large or duplicated assets without
rewriting article content.

## Current Large Assets

The largest files found during the 2026-06-04 audit were GIF/PNG/video assets:

| Size | Path |
| ---: | --- |
| 57.92 MB | `public/Articles/GAMES104/L06-1/GPU计算细分.gif` |
| 57.92 MB | `public/images/articles/06游戏中地形大气和云的渲染上/15988331.gif` |
| 34.39 MB | `public/Articles/GAMES104/L06-2/实现的效果.gif` |
| 20.77 MB | `public/Articles/GAMES104/L06-1/可交互雪地.gif` |
| 20.77 MB | `public/images/articles/06游戏中地形大气和云的渲染上/bbb6e54a.gif` |
| 16.18 MB | `public/Articles/GAMES104/L06-2/UE5中的大气计算.gif` |
| 12.39 MB | `public/Articles/GroomParameters/images/2.gif` |
| 10.86 MB | `public/Articles/22矩阵计算/b80e085f.gif` |
| 10.86 MB | `public/images/22矩阵计算/b80e085f.gif` |
| 10.59 MB | `public/Articles/MathFoundation/旋转矩阵的几何意义解释_x264.mp4` |

## Suggested Follow-Up

- Prefer MP4/WebM for long animations currently stored as GIF.
- Deduplicate mirrored files between `public/Articles` and `public/images` only after
  confirming which path is referenced by Markdown.
- Keep a 5 MB review threshold for new GIF/PNG assets.

