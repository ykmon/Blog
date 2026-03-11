---
title: "GamePlay架构1：Actor和Component"
description: "GamePlay架构1：Actor和Component"
category: "Article"
date: "2026-01-04"
tags:
  - Article
---

# UObject

藉着UObject提供的元数据、反射生成、GC垃圾回收、序列化、编辑器可见、Class Default Object等，UE可以构建一个Object运行的世界

# Actor

UE取一些UObject的泥巴，派生出了Actor。在UE眼中，整个世界从此了有了一个个生动的“演员”，众多的“演员”们，一起齐心协力为观众上演一场精彩的游戏。

脱胎自Object的Actor也多了一些本事：Replication（网络复制）,Spawn（生生死死），Tick(有了心跳)。

- *为何Actor不像GameObject一样自带Transform？*
经过了UE的权衡和考虑，把Transform封装进了SceneComponent,当作RootComponent。

# Component

在早期，每个Actor拥有的技能都是与生俱有，只能父传子一代代的传下去。随着游戏世界的越来越绚丽，需要的技能变得越来越多和频繁改变，这样一组合，Actor数量们就开始爆炸了，难以管理，UE下定决心让Actor轻装上阵，只提供一些通用的基本生存能力，而把众多的“技能”抽象成了一个个“Component”并提供组装的接口，让Actor随用随组装。

ActorComponent下面最重要的一个Component就非SceneComponent莫属了。SceneComponent提供了两大能力：一是Transform，二是SceneComponent的互相嵌套。

- *为何ActorComponent不能互相嵌套？而在SceneComponent一级才提供嵌套？*
UE 的组件体系是**刻意分层设计**的，而不是能力递增式“随意嵌套”。
- *Actor的SceneComponent哲学*
采用**容器 + 组件**结构。车是一个 Actor（容器），车身是 RootComponent，轮子是挂载在下的子 Component。为了**聚合管理和逻辑封装**，体现了从“控制每一个像素”到“控制每一个对象”的工程化思维转变。