---
title: "GamePlay架构(5)：Controller"
description: "UE4 GamePlay 架构学习笔记"
category: "inside-ue4"
date: "2026-01-04"
tags:
  - UE
  - UnrealEngine
  - Basic
image: "/Articles/inside-ue4-chapter05-controller/cover.jpg"
listed: false
---
![cover](/Articles/inside-ue4-chapter05-controller/cover.jpg)


<h2>GamePlay架构5：Controller</h2>

<h2>MVC</h2>

<p>如果依照纯朴的"程序=数据+算法"的结构来看，再算上用于用户显示和输入的界面，那么就得到“程序=数据+算法+显示”。这三大基本块（数据，算法，显示）构成了程序的三大变化，而如何把这三者“+”到一起，用的就是我们的种种设计框架模式。</p>

<p>典型的，对于游戏：</p>

<ul>

<li>“显示”指的是游戏的UI，是屏幕上显示的3D画面，或是手柄上的输入和震动，也可以是VR头盔的镜片和定位，是与玩家直接交互的载体；</li>

<li>“数据”指的是Mesh，Material，Actor，Level等各种元素组织起来的内存数据表示；</li>

<li>“算法”可以是各种渲染算法，物理模拟，AI寻路，本文咱们就先暂时特指游戏开发者们编写的游戏业务逻辑。</li>

</ul>

<p>抽象这三个变化，并归纳关系，就是典型的MVC模式了：</p>

<img loading="lazy" decoding="async" src="https://github.com/tiax615/Learn_InsideUE4/raw/master/Docs/Image/6.png" alt="6">

<h2>AController</h2>

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter05-Controller/image.png" alt="image.png">

<p>观察下从AActor继承下来AController怎么样，Actor比Object多了一些我们正需要的配置动态生成、输入事件响应、Tick、可继承、可容纳Component、可在世界里出现、可在网络间同步。好了，现在就差控制Pawn的能力，那我们就在这个分化出来的AController增加一些控制Pawn的接口，这个思路正是和我们从Actor从分化出Pawn的时候不谋而合！</p>

<p><strong>思考：Controller和Pawn必须1:1吗？</strong></p>

<p>观察UE实现里我们发现Controller里只是保存了一个Pawn指针，而不是数组。那UE为何不实现成多对多呢？我觉得理由往往很简单，就是想保持一定的简单。当前1:1的时候，我们的脑袋逻辑很清晰，我们可以在Controller里直接GetPawn，也可以在Pawn中GetController，都非常方便。</p>

<p><strong>思考：为何Controller不能像Actor层级嵌套？</strong></p>

<p>“控制”本质上来说就是一些代码，不管怎么设计，目的都是用来表达游戏游戏逻辑的。而针对游戏逻辑的复杂，怎么更好的管理组织逻辑代码，我们有状态机，分层状态机，行为树，GOAL（目标导向），甚至你还能搞些神经网络遗传算法机器学习啥的。所以在我们已经有这么多工具的基础上，徒增复杂性是很危险的做法</p>

<p><strong>思考：Controller可以显示吗？</strong></p>

<p>读者你可以亲自在PlayController下挂一些Cube之类的Actor，然后在源码层把这两个值改为false，重新编译运行看下结果，看能否正确显示出来。</p>

<p>估计是可以的。</p>

<p><strong>思考：Controller的位置有什么意义？</strong></p>

<p>UE还提供了一个bAttachToPawn的开关选项，默认是关闭的，UE不会自动的更新Controller的位置信息；而如果打开，就会把Controller附加到Pawn的子节点里面去，让Controller跟随Pawn来移动。你可以把这两种模式想象成一种是上帝视角在千里之外心电感应控制Pawn，另一种是骑在Pawn肩上来指挥。</p>

<p>如果Controller有自己的位置，这样在Respawn重新生成Pawn的时候，你就可以选择在当前位置创建。</p>

<p>UE甚至还隐藏了Controller的一些更新位置的接口，尽量避免让人手动去操纵。</p>

<p><strong>思考：哪些逻辑应该写在Controller中？</strong></p>

<ul>

<li>如果是一些Pawn本身固有的能力逻辑，如前进后退、播放动画、碰撞检测之类的就完全可以在Pawn内实现；而对于一些可替换的逻辑，或者智能决策的，就应该归Controller管辖。</li>

<li>从对应上来说，如果一个逻辑只属于某一类Pawn，那么其实你放进Pawn内也挺好。而如果一个逻辑可以应用于多个Pawn，那么放进Controller就可以组合应用了。</li>

<li>从存在性来说，Controller的生命期比Pawn要长一些，比如我们经常会实现的游戏中玩家死亡后复活的功能。</li>

</ul>

<h2>APlayerState</h2>

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter05-Controller/image 1.png" alt="image.png">

<p>AInfo是存储纯数据的大本营，所以APlayerState自然而然继承他</p>

<p>注意，这个APlayerState也理所当然是生成在Level中的，跟Pawn和Controller是平级的关系，Controller里只不过保存了一个指针引用罢了。</p>

<p><strong>思考：哪些数据应该放在PlayerState中？</strong></p>

<p>从应用范围上来说，PlayerState表示的是玩家的游玩数据，所有PlayerState实际上表达的是当前关卡的玩家得分等数据。</p>

<p>关卡内的其他游戏数据应该归GameState。</p>

<p>跨关卡的统计数据应该放在外面的GameInstance，然后用SaveGame保存起来。</p>

<h2>总结</h2>

<p>UE在Pawn这个层级演化构成了一个最基本和非常完善的Component-Actor-Pawn-Controller的结构：</p>

<img loading="lazy" decoding="async" src="/Articles/InsideUE4/Chapter05-Controller/image 2.png" alt="image.png">
