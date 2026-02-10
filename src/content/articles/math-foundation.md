---
title: "第4章 数学基础"
description: "坐标系、矢量、矩阵、变换与坐标空间"
category: "Unity Shader"
date: "2021-01-15"
readTime: "15 Min Read"
image: "/Articles/math-foundation/Untitled 2.png"
tags:
  - Basic
  - Code
---

<!-- TODO: 视频文件缺失，待补充资源后恢复 -->                    <!-- <video controls><source src="/Articles/math-foundation/旋转矩阵的几何意义解释_x264.mp4" type="video/mp4">您的浏览器不支持视频播放。</video><p class="img-caption">旋转矩阵的几何意义解释</p> -->
<h2>左手坐标系和右手坐标系</h2>
<p>在二维笛卡儿坐标系中，我们总可以通过一些旋转操作来使坐标轴指向相同。从这种意义上来说，所有的二维笛卡儿坐标系都是等价的。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled.png" alt="二维坐标系">
<p>但对于三维笛卡儿坐标系，靠这种旋转有时并不能使两个不同朝向的坐标系重合。因此，就出现了两种不同的三维坐标系：<strong>左手坐标系</strong>和<strong>右手坐标系</strong>。
</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 1.png" alt="左右手坐标系">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 2.png" alt="左右手法则">
<p>除了坐标轴朝向不同之外，左手坐标系和右手坐标系对于正向旋转的定义也不同，即<strong>左手法则(left-band
rule)</strong>和<strong>右手法则(right-band rule)</strong>。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 3.png" alt="旋转定义">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 4.png" alt="左右手移动">
<h2>点和矢量</h2>
<p><strong>点(point)</strong>是n维空间中的一个位置，它没有大小、宽度这类概念。</p>
<p><strong>矢量(vector)</strong>是指n维空间中一种包含了<strong>模(magnitude)</strong>和<strong>方向(direction)</strong>的有向线段。
</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 5.png" alt="点和矢量">
<h3>矢量的模</h3>
<p>三维矢量的模：\\(|v|=\\sqrt{v_x^2+v_y^2+v_z^2}\\)</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 8.png" alt="勾股定理">
<h3>单位矢量</h3>
<p>单位矢量指的是那些模为1的矢量，也被称为<strong>被归一化的矢量</strong>。归一化公式：\\(\\hat{v} = \\frac{v}{|v|}\\)</p>
<h3>矢量的点积</h3>
<p>公式：\\(a \\cdot b = a_x b_x + a_y b_y + a_z b_z\\)</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 9.png" alt="点积符号">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 10.png" alt="点积应用">
<h3>矢量的叉积</h3>
<p>叉积的模：\\(|a \\times b| = |a||b|\\sin\\theta\\)</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 11.png" alt="叉积1">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 12.png" alt="叉积2">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 13.png" alt="叉积方向">
<h2>矩阵</h2>
<p>矩阵就是由m×n个标量组成的长方形数组。\\(m_{ij}\\)表明了这个元素在矩阵m的第i行、第j列。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 14.png" alt="矩阵乘法">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 15.png" alt="矩阵乘法解释">
<p class="img-caption">注意：是矢量点乘的结果</p>
<h3>特殊的矩阵</h3>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 18.png" alt="方块矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 19.png" alt="单位矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 20.png" alt="转置矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 22.png" alt="逆矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 25.png" alt="正交矩阵">
<h2>矩阵的几何意义：变换</h2>
<h3>线性变换与仿射变换</h3>
<p><strong>线性变换</strong>满足：\\(f(x)+f(y)=f(x+y)\\) 和 \\(kf(x)=f(kx)\\)</p>
<p><strong>仿射变换</strong>就是合并线性变换和平移变换的变换类型。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 27.png" alt="仿射变换">
<h3>齐次坐标</h3>
<p>对于一个<em>点</em>，从三维坐标转换成齐次坐标是把其w分量设为1；对于<em>方向矢量</em>，需要把其w分量设为0。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 28.png" alt="基础变换矩阵">
<p class="img-caption">基础变换矩阵</p>
<h3>平移矩阵</h3>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 29.png" alt="平移矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 30.png" alt="平移对矢量无效">
<h3>缩放矩阵</h3>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 32.png" alt="缩放矩阵">
<h3>旋转矩阵</h3>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 35.png" alt="绕X轴旋转">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 36.png" alt="绕Y轴旋转">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 37.png" alt="绕Z轴旋转">
<h3>复合变换</h3>
<p>在绝大多数情况下，我们约定变换的顺序就是<strong>先缩放，再旋转，最后平移</strong>。</p>
<p>\\(P_{new}=M_{translation}M_{rotation}M_{scale}P_{old}\\)</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 38.png" alt="复合变换">
<h2>坐标空间</h2>
<p>我们需要在不同的情况下使用不同的坐标空间，<strong>因为一些概念只有在特定的坐标空间下才有意义</strong>。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 42.png" alt="坐标空间">
<h3>坐标空间的变换</h3>
<p>\\(A_p=M_{c→p}A_c\\) 和 \\(B_c=M_{p→c}B_p\\)</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 43.png" alt="变换矩阵推导1">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 44.png" alt="变换矩阵推导2">
<h3>顶点的坐标空间变换过程</h3>
<p>一个顶点最开始是在模型空间中定义的，最后它将会变换到屏幕空间中。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 50.png" alt="变换过程">
<h4>模型空间</h4>
<p>Unity在模型空间中使用的是左手坐标系，+x轴、+y轴、+z轴分别对应的是模型的右、上和前向。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 51.png" alt="模型空间">
<h4>世界空间</h4>
<p>顶点变换的第一步，就是将顶点坐标从模型空间变换到世界空间中。这个变换通常叫做<strong>模型变换(model transform)</strong>。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 52.png" alt="世界变换">
<h4>观察空间</h4>
<p>Unity中<strong>观察空间</strong>使用的是<strong>右手坐标系</strong>：+x轴指向右方，+y轴指向上方，而+z轴指向的是摄像机的后方。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 55.png" alt="观察空间">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 56.png" alt="观察变换">
<h4>裁剪空间</h4>
<p>裁剪空间的目标是<strong>能够方便地对渲染图元进行裁剪</strong>。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 57.png" alt="透视与正交">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 58.png" alt="视锥体">
<p>透视投影：</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 59.png" alt="透视投影参数">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 60.png" alt="透视投影矩阵">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 61.png" alt="透视变换后">
<p>正交投影：</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 62.png" alt="正交投影">
<h4>屏幕空间</h4>
<p>经过投影矩阵的变换后，我们可以进行裁剪操作。完成裁剪后需要进行真正的投影，把视锥体投影到屏幕空间中。</p>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 66.png" alt="透视除法">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 67.png" alt="正交NDC">
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 68.png" alt="屏幕映射">
<h3>总结</h3>
<img loading="lazy" decoding="async" src="/Articles/math-foundation/Untitled 69.png" alt="完整变换流程">
