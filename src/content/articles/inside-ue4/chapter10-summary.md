---
title: "GamePlay架构(10)：总结"
description: "UE4 GamePlay 架构学习笔记"
category: "InsideUE4"
date: "2026-01-04"
listed: false
tags:
  - UE
  - Code
  - Basic
image: "/Articles/inside-ue4-chapter10-summary/cover.jpg"
---
![cover](/Articles/inside-ue4-chapter10-summary/cover.jpg)


## GamePlay架构10：总结

## 引言

本文作为GamePlay章节的最终章，就是要回顾我们之前探讨过的内容，以一个更高层总览的眼光，把之前的所有内容有机组织起来，思考整体的结构和数据及逻辑的流向。

## 游戏世界

- 在UE的眼里，游戏世界的万物皆Actor，Actor再通过Component组装功能

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image.png" alt="Actor 与 Component 总览图">

- 众多的各种Actor子类又组装成了Level

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 1.png" alt="Level 结构图">

- 一个个的Level，又进一步组装成了World

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 2.png" alt="World 结构图">

- 而World之间的切换，UE用了一个WorldContext来保存切换的过程信息
- 而再往上，就是整个游戏唯一的GameInstance，由Engine对象管理着

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 3.png" alt="WorldContext 与 GameInstance 关系图">

- GameInstance下不光保存着World，同时也存储着Player，有着LocalPlayer用于表示本地的玩家，也有NetConnection当作远端的连接

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 4.png" alt="GameInstance 与 Player 关系图">

- 玩家利用Player对象接入World之后，就可以开始控制Pawn和PlayerController的生成，有了附身的对象和摄像的眼睛。最后在Engine的Tick心跳脉搏驱动下开始一帧帧的逻辑更新和渲染。

## 数据和逻辑

按照MVC的思想，我们可以把整个游戏的GamePlay分为三大部分：表现（View）、逻辑（Controller）、数据（Model）。

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 5.png" alt="MVC 在 GamePlay 中的映射图">

1. 从UObject派生下来的AActor
2. AActor中一些需要逻辑控制的成员分化出了APawn
3. AController是用来控制APawn的一个特殊的AActor
4. 到了Level这一层，UE为我们提供了ALevelScriptActor（关卡蓝图）当作关卡静态性的逻辑载体
5. 而对于一场游戏或世界的规则，UE提供的AGameMode就只是一个虚拟的逻辑载体
6. World构建好了，该派玩家进来了
7. 所有的表示和逻辑汇集到一起，形成了全局唯一的UGameInstance对象，代表着整个游戏的开始和结束。同时为了方便开发者进行玩家存档，提供了USaveGame进行全局的数据配套

## 整体类图

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter10-Summary/image 6.png" alt="整体类图">

由此也可以看出来，UE基于UObject的机制出发，构建出了纷繁复杂的游戏世界，几乎所有的重要的类都直接或间接的继承于UObject，都能充分利用到UObject的反射等功能，大大加强了整体框架的灵活度和表达能力。比如GamePlay中最常用到根据某个Class配置在运行时创建出特定的对象的行为就是利用了反射功能；而网络里的属性同步也是利用了UObject的网络同步RPC调用；一个Level想保存成uasset文件，或者USaveGame想存档，也都是利用了UObject的序列化；而利用了UObject的CDO（Class Default Object），在保存时候也大大节省了内存；这么多Actor对象能在编辑器里方便的编辑，也得益于UObject的属性编辑器集成；对象互相引用的从属关系有了UObject的垃圾回收之后我们就不用担心会释放问题了。想象一下如果一开始没有设计出UObject，那么这个GamePlay框架肯定是另一番模样了。
