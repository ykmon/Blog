---
title: "OpenCode+Skill：从使用到原理"
description: "深入理解 OpenCode 与 Skill 插件系统的使用方法与底层原理"
category: "AI"
date: "2026-02-25"
readTime: "5 Min Read"
image: "/Articles/opencode-skill/cover.jpg"
tags:
  - Code
  - Automation
  - AI
---

![cover](/Articles/opencode-skill/cover.jpg)

# 引言

最近 Claude Code 通过增加空格的方式来降低缓存命中率，今天正好学习一下 OpenCode 以及 Skill 的使用和原理。

# 安装 OpenCode

参考安装教程：[CSDN 教程](https://blog.csdn.net/m0_62128476/article/details/157857984)

# 绑定模型

这里推荐一个中转站，大致 1RMB = 100USD 额度，注意看文档有使用说明：

[New API](https://api.duojie.games/register?aff=Yeb8)

注册好 API 之后，在 CLI 中输入 `/connect` 可以连接模型，再输入 `/models` 即可选择模型。

# OpenCode 裸跑（不用 Skills）

进入你的代码仓库，通过 CMD 命令输入 `opencode` 即可运行。

开始之前最好告诉 AI "新建一个全局规则文件，始终用中文回复"。

AI 跑完之后可以使用 `/new` 命令新建一个会话，用英文 hello，观察是否回复中文。

然后我们就可以初始化项目：

```jsx
/init
```

它会自动分析你的项目结构，并生成一个 `AGENTS.md` 配置文件，为后续的开发打好基础。

其他使用方式，与 IDE 插件的交互是一样的，这里不详细介绍。

## 常见命令

- `/init`：初始化创建一个 AGENTS.md，这个文件对 OpenCode 来说非常重要
- `/review`：review 异动的文件代码，默认是 review 未提交的代码
- `/new`：创建一个新会话
- `/open`：搜索并打开一个文件
- `/terminal`：显示或隐藏一个终端
- `/model`：选择一个模型
- `/mcp`：开启或关闭 MCP
- `/agent`：选择一个 Agent 执行

# Skill

Skill 可以理解为 AI 的增强插件，必须配合 AI 使用，**可以支持某些原本 AI 模型不支持的功能**。

比如，PDF 处理、UI 处理、PPT 处理等。也许有的部分模型能做，但是在 Skill 的协助下，会做得更好！

这里贴上 Anthropics 公开的常用 Skill：

[skills/skills at main · anthropics/skills](https://github.com/anthropics/skills/tree/main/skills)

可以将其复制到自己的项目文件或者放到全局配置中，如不会配置可以和 AI 对话完成。

等配置完毕后，我们再与 AI 对话，AI 并不会常态化加载 Skill，而是在所需的时候选择性加载 Skill 来完成项目。

![Skill 加载示意](/Articles/opencode-skill/image.png)

# 创建一个极简 Skill

参考官方文档：[What are skills? - Agent Skills](https://agentskills.io/what-are-skills)

根据规范，我们来测试创建一个会议整理的 Skill。

在 `.opencode/skills/meeting-summary` 下创建一个 `SKILL.md` 文件：

```jsx
---
name: metting-summary
description: "帮用户整理会议纪要，当 opencode 需要整理会议纪要的时候调用我"
---

# 风格要求

最后一句必须包含一个歇后语或者俗语。
```

需要注意的是，各家的 CLI 的 Skill 路径不一致，注意调整，也可让 AI 帮你调整。

执行效果：

![Skill 执行效果](/Articles/opencode-skill/image%201.png)

# Skill 原理分析

## 按需加载 渐进式披露

虽然 Skill 的模型名字和描述对模型可见，但具体的指令内容只有在真正使用的时候才会被加载。

而一个真正的 Skill 里除了说明，还有 reference 和 scripts 都是满足条件后才触发的：

```
Skill
├── SKILL.md (说明)
├── reference.md
└── scripts (执行脚本)
    ├── xx.py
    └── xx.py
```
