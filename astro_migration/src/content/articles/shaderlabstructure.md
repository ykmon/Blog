---
title: 'Unity ShaderLab'
description: '原文参考：Shader学习（11），作者为冯乐乐。'
pubDate: '2025-12-24'
category: 'Tech'
readTime: '5 Min Read'
heroImage: ''
---

> 代码太长看得人眼花，公式太难看得人犯傻...其实，最好的学习方法是把知识图表化。

本文中，上半段先把一个最简单的顶点片元着色器实现出来，实现的这个无光材质可以控制颜色。下半段则是对每一个关键字进行解释，最终要用流程图来展示Shader每个结构之间的关系。

```c
Shader "Unity Shaders Book/Chapter 5/Simple Shader For Article 11"
{
	Properties
	{
		_Color ("Color Control", Color) = (1.0, 1.0, 1.0, 1.0)
	}
	SubShader
	{
		Pass
		{
			CGPROGRAM

			#pragma vertex vert
			#pragma fragment frag 

			fixed4 _Color;

			struct a2v 
			{
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float4 texcoord : TEXCOORD0;
			};

			struct v2f
			{
				float4 pos : SV_POSITION;
				fixed3 color : COLOR;
			};

			v2f vert(a2v v)
			{
				v2f o;
				o.pos = UnityObjectToClipPos(v.vertex);
				o.color = v.normal * 0.5 + fixed3(0.5,0.5,0.5);
				return o;
			}

			fixed4 frag(v2f i) :SV_Target
			{
				fixed3 c = i.color;
				c *= _Color.rgb;
				return fixed4(c, 1.0);
			}
			ENDCG
		}
	}
}
```

以上是无光材质的代码，简单而且朴实无华。

在Unity中新建材质并应用Shader的效果：

![Shader Effect](https://pic1.zhimg.com/80/v2-76d5c640e538d3f6a6c7c78675d0670c_1440w.webp)

在材质的控制面板调整颜色：

![Inspector](https://pic3.zhimg.com/80/v2-37ca5ec75718fc0f8f9211e57d478256_1440w.webp)

构建粗略的图表：

![Structure 1](https://pic2.zhimg.com/80/v2-e6b4447942d38ce3f97fd32409bfa081_1440w.webp)

## 1\. 属性解析 (Properties)

```
Properties
{
    _Color ("Color Control", Color) = (1.0, 1.0, 1.0, 1.0)
}
```

**_Color**是内部名称，**Color Control**是面板显示名称，**Color**是类型。

![Structure 2](https://pic1.zhimg.com/80/v2-666f91f794d12a296d3ccba6579d102c_1440w.webp)

## 2\. 着色器代码 (SubShader)

```
#pragma vertex vert
#pragma fragment frag
fixed4 _Color;
```

注意：在CG代码块中还需要再次声明属性的类型才能正常使用属性。

![Structure 3](https://pic4.zhimg.com/80/v2-c23c91fd57d8a78d38a2054df06399ef_1440w.webp)

## 3\. 数据流 (Structs)

*   **struct a2v**: Application to Vertex (应用到顶点)。我们需要定义输入什么数据，如 POSITION, NORMAL, TEXCOORD0。
*   **struct v2f**: Vertex to Fragment (顶点到片元)。这是两者的桥梁，必须包含 SV_POSITION。

![Structure 4](/images/ShaderLabStructure/Untitled.png)

## 4\. 顶点着色器 (Vertex Shader)

```
v2f vert(a2v v)
{
	v2f o;
	o.pos = UnityObjectToClipPos(v.vertex);
	o.color = v.normal * 0.5 + fixed3(0.5,0.5,0.5);
	return o;
}
```

这里将法线方向映射为颜色输出。`UnityObjectToClipPos` 将顶点从模型空间转换到裁剪空间。

## 5\. 片元着色器 (Fragment Shader)

```
fixed4 frag(v2f i) :SV_Target
{
	fixed3 c = i.color;
	c *= _Color.rgb;
	return fixed4(c, 1.0);
}
```

SV_Target 告诉 Unity 将输出颜色存储到帧缓存。

![Structure 5](https://pic4.zhimg.com/80/v2-6b2e32f548778e000a3700c162258e1b_1440w.webp)
