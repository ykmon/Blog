---
title: "PC 手机图形 API 介绍"
description: "PC 手机图形 API 介绍"
category: "Article"
date: "2022-09-06"
tags:
  - Article
---

# 前言

电脑的工作原理：电脑是由各种不同的硬件组成，由驱动软件驱使硬件进行工作。所有的软件工程师都会直接或者间接的使用到驱动

**定义：是一个图形库，用于渲染 2D，3D 矢量图形的跨语言，跨平台的应用程序编程接口（API）。针对 GPU**

# 基础概念

**应用端：**

**图元：**

**纹理：**

**纹素：**

**顶点数组：**

**顶点缓冲区：**

**顶点着色器：**

**片元着色器**

以上参考笔记均来自 《Unity Shader 入门精要》知识复习

# DirectX、OpenGL、OpenGL ES 发展史

Khronos 定义了 OpenGL ，微软自己定义了 DirectX ，目前手机，不管是 IOS 还是 Android，都是支持 OpenGL ES

电脑： Windows 系统支持 DirectX 和 OpenGL，Linux/Mac（Unix）系统支持 OpenGL

OpenGL的发展过程中，从1.0开始有一个分支，一个是OpenGL ES1.1 ，一个是 OpenGL 2.0，最后都是 OpenGL ES 2.0

在 2.0 中都是增加了一些片元着色器，替代了一些原先的方法

### 20 世纪 90 年代

OpenGL 开放

### 2000 年

OpenGL ES 开放

直到现在的年代，OpenGL ES 已经到了 3.2 版本

### 2005 年

OpenGL SC  开放

### 2008 年

开放基层更高效计算的 OpenCL

### 2014 年

开放 SPIR

### 2015 年

Vulkan 开放，更加高效的 GPU 使用效率

# OpenGL ES

### 相同点

相比于 OpenGL ES 1.x 系列的古董功能管线，OpenGL ES 2.0 和 OpenGL ES 3.0 都是可编程图形管线。开发者可以自己编写图形管线中的 顶点着色器 和 片元着色器 两个阶段的代码

### OpenGL ES 渲染流程

### 2.0 版本

首先是模型准备，然后由顶点着色器去编辑，然后把这些点面进行图元重组，然后进行光栅化，然后经过片元着色器的编写，最后通过三种测试，最后输出到 Frame Buffer 中

### 3.1版本

新拿到这些 Buffer 缓存，然后传到顶点池，然后传给顶点着色器，然后顶点着色器进行分布 Transform 的 Feedback，进行一个返回，让我们去了解一些数据给下一阶段是使用，下一阶段拿到这些数据使用，之后要去进行光栅化，光栅化之后就是片元着色器的计算，之后进行逐片元渲染，然后输入到 Frame Buffer 中



### 不同点

1.向下兼容

2.新特性

3.渲染管线

4.着色器脚本编写