---
title: "头发_Groom物理参数解释"
description: "头发_Groom物理参数解释"
category: "Unreal Engine"
date: "2023-01-12"
tags:
  - Article
image: "/Articles/头发_groom物理参数解释/cover.jpg"
---
![cover](/Articles/头发_groom物理参数解释/cover.jpg)


# 解算器设置Solver Settings

启用模拟我们发现整个头发的模拟都是基于Niagara例子来驱动的；但不需要担心，大多数情况下应用预设即可

***Groom Rods***，对于***弯曲约束Bend Constraint***的表现更强，***拉伸约束***表现较弱

***Groom Springs***，对于***拉伸约束Stretch Constraint***表现更强，***弯曲约束***较弱

***Custom Solver***，通过自定义Niagara系统来驱动，可以兼顾弹力和弯曲，但自定义过程复杂

***Sub Steps***：每帧计算次数；如果该数值过低在运行时会丢失大量细节

***Iteration***：迭代次数

这两个参数共同控制***材质约束Material Constraints***中的细节程度

# 外力External Forces

如属性标签所示，无需赘述

# 材质约束MaterialConstraints

## 弯曲约束BendConstraint

***解算弯曲SolveBend***，根据guide信息产生的约束来单独解算

***投射弯曲ProjectBend***，顶点之间相关信息的约束解算

***弯曲阻尼BendDamping***，变形后恢复的速度

***弯曲刚度BendStiffness***，变形的幅度，数值越大幅度越小

***刚度曲线StiffnessScale***，基于***弯曲刚度***变形幅度曲线（X轴0是发根，1是发尖）

## 拉伸约束StretchConstraint

同上**弯曲约束BendConstraint**，只是变为了拉伸效果

## 碰撞约束CollisionConstraint

***解算弯曲SolveBend***，根据guide信息产生的约束来单独解算

***投射弯曲ProjectBend***，顶点之间相关信息的约束解算,建议勾选，防止出现Groom穿插

***静态摩擦力StaticFriction***，静止时和碰撞体***physics asset***交互时的摩擦力，主要是身体和肩部

***动态摩擦力KineticFriction***，动态时和碰撞体***physics asset***交互时的摩擦力，主要是身体和肩部

***发束黏度StrandsViscosity***，(0~1之间)头发之间的自碰撞粘黏的系数，数值越大约会感觉头发是一个整体，而不是一根一根的

***网格尺寸Grid Dimension***，暂未知具体用处

***碰撞半径CollisionRadius***，头发自身之间以及和身体的碰撞半径

***半径缩放RadiusScale***，基于***碰撞半径***变形幅度曲线（X轴0是发根，1是发尖）

# 发束参数

***发束尺寸StrandsSize***，**每个guide上用于模拟的粒子数**

***发束密度StrandsDensity***，用于质量和惯性计算

***发束平滑StrandsSmoothing***，基于***发束尺寸StrandsSize***的粒子数进行插值平滑

***发束粗度StrandsThickness***，用于质量和惯性计算

***粗度尺寸曲线ThicknessScale***，基于***弯曲刚度***变形幅度曲线（X轴0是发根，1是发尖）