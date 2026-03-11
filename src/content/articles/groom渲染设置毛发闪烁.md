---
title: "Groom渲染设置（毛发闪烁）"
description: "Groom渲染设置（毛发闪烁）"
category: "Unreal Engine"
date: "2023-01-12"
tags:
  - Article
  - 2026-03-11
---

# 控制台设置

r.GPUSkin.Support16BitBoneIndex=True

r.GPUSkin.UnlimitedBoneInfluences=True

SkeletalMesh.UseExperimentalChunking=1

r.SkinCache.CompileShaders=True

r.SkinCache.DefaultBehavior=0

r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange=True

r.RayTracing=True

r.Mobile.EnableMovableSpotlights=True

r.Mobile.EnableMovableSpotlightsShadow=True

r.HairStrands.Voxelization.DensityScale=1

## 抗锯齿

r.HairStrands.Visibility.PPLL 效果最好，开销最大

r.HairStrands.Visibility.MSAA.SamplePerPixel 2,4,8 效果和效率综合最好

### 孤立毛发

# 项目设置

开启硬件光线追踪

在 **项目设置（Project Settings）**中，打开 **引擎（Engine）> 渲染（Rendering）> 硬件光线追踪（Hardware Ray Tracing）**，然后重启编辑器。

开启**光线追踪阴影** 和 **光线追踪天光**；**默认RHI**修改为**DirectX 12**

# 灯光设置

## 三角形、锯齿形闪烁

在点光源、聚光灯、面光源勾选下列三个选项

- 投射光追阴影
- 影响光线追踪反射
- 影响光线追踪全局光照
- 提高逐像素采样
## 蓝色噪点闪烁

r.HairStrands.Skylighting=0

## 大块闪烁

开启灯光的Deep Shadow,深度阴影

这种阴影是专门作用于毛发让它产生高质量阴影效果的。如果不开启深度阴影，毛发还可能有透光泛白等各种不良效果。

Layer 0-1调节阴影效果。0为线性，1为指数。有时候即使开启深度阴影，毛发也会突然闪一下，也有这个数值的原因。

DeepShadow不必每盏灯都开启，根据渲染效果按需开启

# 光影

普通灯光打开***投射体积阴影***

主光源打开***DeepShadow***并按需调整数值

特写镜头中根据效果，把主光源放进***Sequencer***,将是否开启DeepShadow进行根据镜头的控制（视角拉远时关闭）