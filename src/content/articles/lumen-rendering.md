---
title: "高品质渲染解析"
description: "Lumen光线追踪与Surface Cache"
category: "Unreal Engine"
date: "2021-08-20"
tags:
  - UE
  - UnrealEngine
  - Shader
  - Code
  - Basic
readTime: "8 Min Read"
image: "/Articles/lumen-rendering/Untitled 7.png"
---
<p><strong>Lumen适用场景：</strong></p>
<ul>
<li>户外/室内 灯光</li>
<li>工作室 灯光</li>
<li>大世界 灯光</li>
</ul>
<p><strong>Lumen光线追踪：</strong></p>
<ul>
<li><strong>软件光追</strong>：实时更多，生成距离场计算的光追，是一种折中的方案</li>
<li><strong>硬件光追</strong>：离线方案，真正的追踪物体的三角面，需要使用DX12并且RTX2000以上的显卡</li>
</ul>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled.png" alt="Lumen光追">
<h2>Surface Cache 表面缓存</h2>
<p>Lumen之所以性能能如此高，是因为Lumen会预先在场景中生成<strong>SurfaceCache</strong>，用更少的<strong>MeshCards</strong>生成一个简易的用于光追模型，能让光线更快的找到物体信息并计算。
</p>
<p>如果模型过于复杂，简易的MeshCards无法精准的表达模型的外形，可以在模型的Details中增加MeshCards的数量用于生成更精准的SurfaceCache。</p>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 1.png" alt="Surface Cache">
<p>因此，在制作一些复杂模型的时候，建议使用模块化搭建的导入，让SurfaceCache能够精准包裹单个模块即可。</p>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 2.png" alt="模块化搭建">
<p>使用命令 <code>r.Lumen.Visualize.CardPlacement 1</code> 可以在视窗观察每个模型的MeshCards。</p>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 3.png" alt="可视化MeshCards">
<p>在<strong>lumen—表面缓存</strong>视图中：</p>
<ul>
<li><strong>粉色部分</strong>：说明没有得到一个很好的表面缓存</li>
<li><strong>黄色部分</strong>：说明完全没有surfaceCache，主要表现在反射上不太正确</li>
</ul>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 4.png" alt="表面缓存问题">
<h3>粉色问题解决方案</h3>
<ol>
<li>增加后处理体积PPV中的sceneDetail
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 5.png" alt="SceneDetail设置">
</li>
<li>提高MeshCards的数量
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 6.png" alt="MeshCards设置">
</li>
<li>将模型拆开</li>
</ol>
<h3>黄色问题解决方案</h3>
<ul>
<li>提高尺寸（不建议）</li>
<li>检查模型</li>
</ul>
<div class="tip-box">
<p>💡 在制作场景时，确保场景中的Mesh是合理的，不是由大量小的mesh组成的Merge，尽可能保持独立。</p>
</div>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 7.png" alt="不合理的Mesh">
<p class="img-caption">过多小的mesh会产生不合理的Lumen漏光</p>
<p><strong>建议：</strong>如果整体上是共面的Mesh（墙上的画框），合并在一起没有关系；如果存在过多的转角且挤出（墙上的书架），则不适合合并。</p>
<h2>软件光线追踪</h2>
<p>在室外场景，能达到完全实时的光照，并且性能很好。</p>
<ol>
<li>将环境混合混合器的功能全部打开</li>
<li>将直射光设置为可移动，并将光线和太阳光绑定
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 8.png" alt="光线设置">
</li>
<li>将skylight中的实时捕获打开</li>
</ol>
<div class="tip-box">
<p>💡 LumenGI的颜色极大程度上受PBRShader上的AlbedoColor影响，它并非物理正确的渲染效果。</p>
</div>
<p><strong>注意事项：</strong></p>
<ul>
<li>MehsCards如果都是特别规整的情况下，软件光追的GI效果将会非常好</li>
<li>Lumen对于镜面反射表现很差，这是Lumen的限制，无论如何也达不到RayTracing那种非常sharp的效果</li>
<li>Lumen的效果和贴图的Albedo固有色强相关，在有的颜色下，使用SurfaceCache的反射极易造成溢色的出现</li>
</ul>
<h2>MRQ设置</h2>
<p>在视图中把可视质量设为电影级：</p>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 9.png" alt="电影级质量">
<p>在MRQ中只需要开一个抗锯齿即可：</p>
<img loading="lazy" decoding="async" src="/Articles/lumen-rendering/Untitled 10.png" alt="MRQ抗锯齿">
<p>分辨率越高，Count数越低。</p>
<blockquote>
<p><strong>Lumen 没有AO这个特性</strong></p>
<p>Lumen暂时也没有一个很好解决透明的一个算法，所以这里也是沿用的RTX的算法。</p>
</blockquote>
