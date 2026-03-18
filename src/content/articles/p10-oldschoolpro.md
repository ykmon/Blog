---
title: "P10 OldSchoolPro"
description: "P10 OldSchoolPro"
category: "Article"
date: "2022-05-31"
tags:
  - Article
---

创建Shader首先分析光照构成



## OldSchoolPro的ShaderForge连连看

Cubemap采样：texCUBElod，采样的不是UV，而是一个四维坐标采样（float4），前三维xyz轴表述：世界坐标系下的观察方向的反射方向，w分量是Mipmap的值;通过高光、模糊等调节不同区域的模糊程度

```c++
float cubemapMip = lerp(_CubemapMip, 1.0, var_SpecTex.a);
float3 var_Cubemap = texCUBElod(_Cubemap.float4(vrDirWS, cubemapMip)).grb;
```

SpecularTexture可以通过RoughnessTexture反向，然后通过SD中的Level处理到一个合适的位置。