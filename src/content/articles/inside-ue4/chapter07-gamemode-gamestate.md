---
title: "GamePlay架构(7)：GameMode和GameState"
description: "UE4 GamePlay 架构学习笔记"
category: "inside-ue4"
date: "2026-01-04"
listed: false
tags:
  - UE
  - Basic
---

<h2>GamePlay架构7：GameMode和GameState</h2>

<h2>GameMode</h2>

<p>cocos2dx会认为游戏就是由不同的Scene切换组成的，每个Scene又由Layer组成；Unity也认为游戏就是一个个Scene；而UE的视角的是，游戏是由一个个World组成的，World又是由Level组成的。</p>

<p>玩法就是“逻辑”，场景就是“表示”。因此UE的世界观是，World更多是逻辑的概念，而Level是资源场景表示。</p>

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter07-GameModeGameState/image.png" alt="image.png">

<p>在功能实现上有许多的接口，但主要可以分为以下几大块：</p>

<p>1. Class登记，GameMode里登记了游戏里基本需要的类型信息，在需要的时候通过UClass的反射可以自动Spawn出相应的对象来添加进关卡中。</p>

<p>2. 游戏内实体的Spawn，不光登记，GameMode既然作为一场游戏的主要负责人，那么游戏的加载释放过程中涉及到的实体的产生。</p>

<p>3. 游戏的进度，一个游戏支不支持暂停，怎么重启</p>

<p>4. Level的切换，或者说World的切换更加合适</p>

<p>5. 多人游戏的步调同步，在多人游戏的时候，我们常常需要等所有加入的玩家连上之后，载入地图完毕后才能一起开始逻辑。</p>

<p><strong><em>思考：多个Level配置不同的GameMode时采用的是哪一个GameMode？</strong></em></p>

<p>当有多个Level的时候，一定是PersisitentLevel和多个StreamingLevel，这时就算它们配置了不同的GameModeClass，UE也只会为第一次创建World时加载PersistentLevel的时候创建GameMode</p>

<p><strong><em>思考：Level迁移时GameMode是否保持一致？</strong></em></p>

<p>无论是否开启 “无缝迁移（bUseSeamlessTravel）”，Level 迁移后都会生成<strong>新的 GameMode</strong>，原 GameMode 会被释放（即使新 Level 配置的 GameModeClass 与原 Class 类型一致），需注意原 GameMode 中保存的状态会丢失（但 Pawn 和 Controller 默认保持一致）。</p>

<p><strong><em>思考：哪些逻辑应该写在GameMode里？哪些应该写在Level Blueprint里？</strong></em></p>

<p>1. 概念上，Level是表示，World是逻辑。所以GameMode应该专注于逻辑的实现，而LevelScriptActor应该专注于本Level的表示逻辑</p>

<p>2. 组合上，同Controller应用到Pawn一样道理，因为GameMode是可以应用在不同的Level的，所以通用的玩法应该放在GameMode里。</p>

<p>3. GameMode只在Server存在（单机游戏也是Server），对于已经连接上Server的Client来说，因为游戏的状态都是由Server决定的，Client只是负责展示，所以Client上是没有GameMode的</p>

<p>4. 跟下层的PlayerController比较，GameMode关心的是构建一个游戏本身的玩法，PlayerController关心的玩家的行为。</p>

<p>5. 跟上层的GameInstance比较，GameInstance关注的是更高层的不同World之间的逻辑，虽然有时候他也把手伸下来做些UI的管理工作，不过严谨来说，在UE里UI是独立于World的一个结构</p>

<h2>GameState</h2>

<p>对于一场游戏，也需要一个State来保存当前游戏的状态数据，比如任务数据等。</p>

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter07-GameModeGameState/image 1.png" alt="image.png">

<h2>GameSession</h2>

<p>是在网络联机游戏中针对Session使用的一个方便的管理类，并不存储数据</p>

<h2>总结</h2>

<p>UE再次用Actor分化派生的思想，用同样套路的AGameMode和AGameState支持了玩法和表现的解耦分离和自由组合，并很好的支持了网络间状态的同步。</p>
