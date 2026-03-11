---
title: "OpenCode+Skill：从使用到原理"
description: "OpenCode+Skill：从使用到原理"
category: "Article"
date: "2026-02-24"
tags:
  - Code
  - 2026-03-11
---

# 引言

最近Cluade Code通过增加空格的方式来降低缓存命中率，今天正好学习一下OpenCode以及Skill的使用和原理

# 安装OpenCode

# 绑定模型

这里推荐一个中转站，大致1RMB=100USD额度，注意看文档有使用说明

注册好API之后，在CLI中输出/connet可以连接模型，再输入/models即可选择模型

# OpenCode裸跑（不用Skills)

进入你的代码仓库，通过CMD命令输入OPENCODE即可运行

开始之前最好告诉AI“新建一个全局规则文件，始终用中文回复”

AI跑完之后可以使用/new命令新建一个会话，用英文hello，观察是否回复中文。

然后我们就可以初始化项目

```javascript
/init
```

它会自动分析你的项目结构，并生成一个 `AGENTS.md` 配置文件，为后续的开发打好基础。

其他使用方式，与 IDE 插件的交互是一样的，这里不详细介绍。

一些常见命令：

- `/init` ：初始化创建一个 AGENTS.md ，这个文件对 OpenCode 来说非常重要
- `/review `：review 异动的文件代码，默认是 review 未提交的代码；
- `/new` ：创建一个新会话
- `/open` ：搜索并打开一个文件
- `/terminal`：显示或隐藏一个终端
- `/model`：选择一个模型
- `/mcp`：开启或关闭 MCP
- `/agent`：选择一个 Agent 执行
# Skill

Skill可以理解为AI的增强插件，必须配合AI使用，**可以支持某些原本AI模型不支持的功能。**

比如，PDF处理、UI处理、PPT处理等。也许有的部分模型能做，但是在Skill的协助下，会做得更好！

这里贴上Anthropics公开的常用skill：

可以将其复制到自己的项目文件或者放到全局配置中，如不会配置可以和AI对话完成。

等配置完毕后，我们再与AI对话，AI并不会常态化加载Skill，而是在所需的时候选择性加载Skill来完成项目

# 创建一个极简Skill

根据规范，我们来测试创建一个会议整理的skill

在.opencode/skills/meeting-summary下创建一个SKILL.md文件

```javascript
---
name:metting-summary
description:"帮用户整理会议纪要，当opencode需要整理会议纪要的时候调用我
---

#风格要求
最后一句必须包含一个歇后语或者俗语。
```

需要注意的是，各家的CLI的skill路径不一致，注意调整，也可让AI帮你调整

执行效果：

# Skill原理分析

## 按需加载 渐进式披露

虽然Skill的模型名字和描述对模型可见，但具体的指令内容只有在真正使用的时候才会被加载。

而一个真正的Skill里除了说明，还有reference和scripts都是满足条件后才触发的

Skill
├── SKILL.md (说明)
├── reference.md
└── scripts (执行脚本)
├── xx.py
└── xx.py