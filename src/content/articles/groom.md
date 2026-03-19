---
title: "Groom"
description: "Groom"
category: "Unreal Engine"
date: "2024-08-31"
tags:
  - Article
image: "/Articles/groom/cover.jpg"
---
![cover](/Articles/groom/cover.jpg)


# **工程**

\\192.168.30.40\创新组\毛发预研

# **毛发制作**

节点需求功能列于子文档中，**皆是经过筛选后完成一个完整毛发编辑所需功能**

红色：好用功能

## **制作部分总结**

💡当前在整个毛发制作过程中，可预知的重要难点在于当Curves过多时，如果在UE视窗内保持流畅的交互体验，在创建Clump的过程中，会反复设计返回到Guides状态去修改状态；

以及如何尽可能的在梳理Guides之后的Clump编辑过程中尽可能的保持非破坏性的流程，这也与Xgen中的智能交互毛发目标一致。

如果以UE的Groom系统为目标产品假设，在导入过程中可接受常规FBX以及Almbic动画；

在导出过程中只需要确保导出的Alembic文件中有任一Groom属性被赋予，即可被UE识别为Groom而非常规Alembic。

💡整体毛发制作这个环节在整个CG生产管线中是相对独立的部分，输入动画和模型，导出Alembic，中间不涉及其他部门、其他环节的交互问题。担心在于对于毛发编辑的交互流畅度，这也是在我们服装结算环节比较繁重的问题。

## **一图流**

## **输出结构体**

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-alembic-for-grooms-in-unreal-engine?application_version=5.3

### **Houdini官方labs节点可选输出属性**

- color
- id
- group_id
- group_name
### **其他Unreal可识别属性**

- width
- guide
- root_uv
- cloest_guides
- guide_weights




### **Unreal效果（使用Groom Simulation）**

此处为语雀视频卡片，点击链接查看：bandicam 2024-06-07 16-31-33-306.mp4

### **Guide Deform**

- Groom Object
- Animated Skin
- Range Frame
### **Guide Simulate**

- Simulation
- Vellum Solver
- Vellum Physical
- Vellum Constraints
- Vellum Forces
# **毛发解算**

## **解算部分总结**

💡对于常见影视番剧中毛发的使用，还需要和行业公司进行沟通他们的具体需求和规范。

💡Houdini的毛发解算，完全基于Vellum系统，所用到的功能以及Trick在浏览了很多教程后发现是比服装解算少很多的，项目上用到的约束类型也相对单一，主要是glue\pin to target\attach这三种，在标准资产环境下，学习毛发解算的门槛是要比服装解算低很多的。

💡UE的优势在于哪怕百万级的Curve进入UE，在不考虑其余性能开销的情况下，也能做到实时模拟，还提供了丰富的参数配置，并且基于Niagara的Groom求解器还具有一定的自定义能力；但另一部分是，UE没有任何修改顶点层级的编辑能力，它必须配合其他DCC软件

解算问题暂时能预想到的是，我们目前解算器的底层是基于UV的，但是毛发的解算是基于Curves和Points的，也无法产生UV。假设产品最终能够做到同步解算，那势必是需要新增一个新的求解器的。

整体来说，预计毛发制作编辑器的开发是更为重要和困难的，确保能正确的生成、调整所需要的属性。

## **一图流**



## **Trick**

在houdini中对于多层级头发互相碰撞，主要优先解算低层级，然后将低层级的引导线转换为Polygon，再与高层级的引导线碰撞