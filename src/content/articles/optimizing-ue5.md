---
title: "Optimizing UE5"
description: "Optimizing UE5"
category: "Unreal Engine"
date: "2024-09-01"
tags:
  - UE
---

# 什么是Virtual

Virtual Texture分为两种，一种是Streaming Virtual Texture(简称SVT)，另一种是Runtime Virtual Texture(简称RVT)

## SVT

SVT和普通贴图并没有太大区别，主要区别在于他们的加载方式

### 优点

普通贴图主要是根据物体占据整个屏幕的比例来动态的调用不同MipMap层级的贴图，占据屏幕的比例越大，加载的Mip层级越低 

SVT是率先降贴图分为不同的Tile，一般分为128个Tile，将根据哪些地方要渲染，根据一个Page Table将对应的Tile添加到实际需要渲染的Physical Texture中，同时也会考虑Mip，因此同样的分辨率SVT会更节省内存

### 缺点

SVT因为最低只支持128Tile，所以只能支持到Mip4，这在绝大多数情况下不会是问题，但在特别远的情况下可能会有闪烁的情况发生

SVT的过滤方式为三线性过滤，会有一定的过滤瑕疵，开TAA会有所缓解

### 开启SVT

右键转换SVT会自动对使用的材质添加一个Virtual Texture的采样器以防止报错

### Debug

可以使用 *stat virtualtexturing、r.VT.Borders 1 *来调试

使用*r.VT.Flush*来刷新