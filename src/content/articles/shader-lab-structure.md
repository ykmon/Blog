---
title: "ShaderLab 结构详解"
description: "通过图解方式拆解 Unity ShaderLab 的核心结构，让代码不再只是枯燥的字符"
category: "Shader"
date: "2022-12-10"
readTime: "4 Min Read"
image: "/Articles/ShaderLabStructure/images/cover.webp"
tags:
  - Unity
  - Code
---

<p class="lead italic text-gray-500">原文参考：<a href="https://zhuanlan.zhihu.com/p/142665509"
                            class="text-ochre">Shader学习（11）</a>，作者为冯乐乐。</p>
                    <blockquote>
                        代码太长看得人眼花，公式太难看得人犯傻...其实，最好的学习方法是把知识图表化。
                    </blockquote>
                    <p>本文中，上半段先把一个最简单的顶点片元着色器实现出来，实现的这个无光材质可以控制颜色。下半段则是对每一个关键字进行解释，最终要用流程图来展示Shader每个结构之间的关系。</p>
                    <pre><code class="language-c">Shader "Unity Shaders Book/Chapter 5/Simple Shader For Article 11"
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
}</code></pre>
                    <p>以上是无光材质的代码，简单而且朴实无华。</p>
                    <p>在Unity中新建材质并应用Shader的效果：</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-76d5c640e538d3f6a6c7c78675d0670c.webp"
                        alt="Shader Effect" class="rounded-sm shadow-md">
                    <p>在材质的控制面板调整颜色：</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-37ca5ec75718fc0f8f9211e57d478256.webp" alt="Inspector"
                        class="rounded-sm shadow-md">
                    <p>构建粗略的图表：</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-e6b4447942d38ce3f97fd32409bfa081.webp"
                        alt="Structure 1" class="rounded-sm shadow-md">
                    <h2>1. 属性解析 (Properties)</h2>
                    <pre><code>Properties
{
    _Color ("Color Control", Color) = (1.0, 1.0, 1.0, 1.0)
}</code></pre>
                    <p><strong>_Color</strong>是内部名称，<strong>Color Control</strong>是面板显示名称，<strong>Color</strong>是类型。</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-666f91f794d12a296d3ccba6579d102c.webp"
                        alt="Structure 2" class="rounded-sm shadow-md">
                    <h2>2. 着色器代码 (SubShader)</h2>
                    <pre><code>#pragma vertex vert
#pragma fragment frag
fixed4 _Color;</code></pre>
                    <p>注意：在CG代码块中还需要再次声明属性的类型才能正常使用属性。</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-c23c91fd57d8a78d38a2054df06399ef.webp"
                        alt="Structure 3" class="rounded-sm shadow-md">
                    <h2>3. 数据流 (Structs)</h2>
                    <ul>
                        <li><strong>struct a2v</strong>: Application to Vertex (应用到顶点)。我们需要定义输入什么数据，如 POSITION, NORMAL,
                            TEXCOORD0。</li>
                        <li><strong>struct v2f</strong>: Vertex to Fragment (顶点到片元)。这是两者的桥梁，必须包含 SV_POSITION。</li>
                    </ul>
                    <img loading="lazy" decoding="async" src="/Articles/shader-lab-structure/Untitled.png" alt="Structure 4" class="rounded-sm shadow-md">
                    <h2>4. 顶点着色器 (Vertex Shader)</h2>
                    <pre><code>v2f vert(a2v v)
{
	v2f o;
	o.pos = UnityObjectToClipPos(v.vertex);
	o.color = v.normal * 0.5 + fixed3(0.5,0.5,0.5);
	return o;
}</code></pre>
                    <p>这里将法线方向映射为颜色输出。<code>UnityObjectToClipPos</code> 将顶点从模型空间转换到裁剪空间。</p>
                    <h2>5. 片元着色器 (Fragment Shader)</h2>
                    <pre><code>fixed4 frag(v2f i) :SV_Target
{
	fixed3 c = i.color;
	c *= _Color.rgb;
	return fixed4(c, 1.0);
}</code></pre>
                    <p>SV_Target 告诉 Unity 将输出颜色存储到帧缓存。</p>
                    <img loading="lazy" decoding="async" src="/Articles/ShaderLabStructure/images/v2-6b2e32f548778e000a3700c162258e1b.webp"
                        alt="Structure 5" class="rounded-sm shadow-md">
