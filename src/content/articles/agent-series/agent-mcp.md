---
title: "MCP 与 Function Calling"
description: "从 Function Calling、AI Agent 到 MCP：三者各自解决什么问题，MCP 的 Host、Client、Server 与数据源如何协作，以及什么时候该用 MCP、什么时候该用 Skill。"
category: "Agent 系列"
date: "2026-11-03"
tags:
  - AI
  - Code
readTime: "6 Min Read"
---

## Function Calling、AI Agent、MCP 这三者之间有什么区别？

### Function Calling

- Function Calling 指的是 AI 模型根据上下文自动执行函数的机制。
- Function Calling 充当了 AI 模型与外部系统之间的桥梁，不同的模型有不同的 Function Calling 实现，代码集成的方式也不一样。由不同的 AI 模型平台来定义和实现。

如果我们使用 Function Calling，那么需要通过代码给 LLM 提供一组 functions，并且提供清晰的函数描述、函数输入和输出，那么 LLM 就可以根据清晰的结构化数据进行推理，执行函数。

Function Calling 的缺点在于处理不好多轮对话和复杂需求，适合边界清晰、描述明确的任务。如果需要处理很多的任务，那么 Function Calling 的代码比较难维护。

### Model Context Protocol（MCP）

- MCP 是一个标准协议，如同电子设备的 Type C 协议（可以充电也可以传输数据），使 AI 模型能够与不同的 API 和数据源无缝交互。
- MCP 旨在替换碎片化的 Agent 代码集成，从而使 AI 系统更可靠，更有效。通过建立通用标准，服务商可以基于协议来推出它们自己服务的 AI 能力，从而支持开发者更快的构建更强大的 AI 应用。开发者也不需要重复造轮子，通过开源项目可以建立强大的 AI Agent 生态。
- MCP 可以在不同的应用/服务之间保持上下文，从而增强整体自主执行任务的能力。

可以理解为 MCP 是将不同任务进行分层处理，每一层都提供特定的能力、描述和限制。而 MCP Client 端根据不同的任务判断，选择是否需要调用某个能力，然后通过每层的输入和输出，构建一个可以处理复杂、多步对话和统一上下文的 Agent。

### AI Agent

- AI Agent 是一个智能系统，它可以自主运行以实现特定目标。传统的 AI 聊天仅提供建议或者需要手动执行任务，AI Agent 则可以分析具体情况，做出决策，并自行采取行动。
- AI Agent 可以利用 MCP 提供的功能描述来理解更多的上下文，并在各种平台/服务自动执行任务。

## MCP 如何工作

![MCP 架构：Host 中的 MCP Client 分别与多个 MCP Server 建立 1:1 连接，Server 再对接本地数据源或远程服务](/images/agent-series/agent-mcp-architecture.png)

总共分为了下面五个部分：

- MCP Hosts：Hosts 是指 LLM 启动连接的应用程序，像 Cursor、Claude Desktop、[Cline](https://github.com/cline/cline) 这样的应用程序。
- MCP Clients：客户端是用来在 Hosts 应用程序内维护与 Server 之间 1:1 连接。
- MCP Servers：通过标准化的协议，为 Client 端提供上下文、工具和提示。
- Local Data Sources：本地的文件、数据库和 API。
- Remote Services：外部的文件、数据库和 API。

整个 MCP 协议的核心在于 Server，因为 Host 和 Client 相信熟悉计算机网络的都不会陌生，非常好理解。

MCP Server 是为了实现 AI Agent 的自动化而存在的，它是一个中间层，告诉 AI Agent 目前存在哪些服务，哪些 API，哪些数据源，AI Agent 可以根据 Server 提供的信息来决定是否调用某个服务，然后通过 Function Calling 来执行函数。

## 何时使用 MCP，何时使用 Skill

- 需要把某种外部能力接入模型时，用 MCP：比如让模型查询公司日历、读取数据库，或调用内部系统创建工单。MCP 规定这些能力怎样暴露、发现和调用。
- 需要让模型按一套步骤完成某类任务时，用 Skill：比如规定“整理会议纪要时，先提取决定和待办，再按指定格式输出”。Skill 通常用说明、参考资料或脚本告诉模型怎样工作。

举个会议安排的例子：MCP 提供“查同事空闲时间”和“创建日历会议”工具；Skill 规定安排会议时先确认参会人和时长，再查空档，最后创建会议。**MCP 提供能力，Skill 组织任务流程**；一个 Skill 可以调用 MCP 提供的工具。
