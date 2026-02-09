---
title: "Substance Painter 小技巧"
description: "材质制作、UV处理、贴花融合等实用技巧"
category: "3D Art"
date: "2021-09-15"
readTime: "5 Min Read"
image: "/Articles/substance-painter/Untitled.png"
tags:
  - Others DCC
---

<h3>制作模型时尽可能把单独的模块分开</h3>
                    <p>把材质按照金属和非金属大致分类并给默认材质。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled.png" alt="模块分离">
                    <h3>使用同一个材质的模块排除功能</h3>
                    <p>通过右键文件夹右方的"全部排除"功能，可以实现对应材质只在对应模型上使用的功能，数字1是选中的组件数量。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 1.png" alt="排除功能">
                    <h3>UV接缝处理</h3>
                    <p>UV的接缝处时常会有问题，可以将映射模式更改为<strong>Tri-planar三面映射</strong>并调整硬度缓解。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 2.png" alt="UV接缝1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 3.png" alt="UV接缝2">
                    <h3>基本颜色层次变化</h3>
                    <p>基本颜色层次的变化可以仅仅通过三个不同颜色叠加而成。注意调整粗糙度、金属度、颜色、透明度等。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 4.png" alt="颜色层次1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 5.png" alt="颜色层次2">
                    <h3>效果叠加技巧</h3>
                    <p>两个不同的效果作用于同一位置时，上面的效果可以采用线性叠加和调整透明度的方法。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 6.png" alt="效果叠加">
                    <h3>图层控制单一属性</h3>
                    <p>图层可以通过选择控制单一属性，也可以选择对应通道后调整透明度，将会只调整选中的部分。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 7.png" alt="图层控制">
                    <h3>添加其他材质（如透明度）</h3>
                    <p>在着色器设置中更改。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 8.png" alt="着色器设置">
                    <h3>贴花融合技巧</h3>
                    <p>降低明度、增加阴影、复制叠加、Grung paint streak贴图叠加。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 9.png" alt="贴花融合1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 10.png" alt="贴花融合2">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 11.png" alt="贴花融合3">
                    <h3>透明区域设置</h3>
                    <p>对透明区域单独复制一个材质，材质球修改混合模式为透明；开启双面显示；修改光照模式为表面半透明体积；透明通道存在BaseColor的A通道里。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 12.png" alt="透明设置1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 13.png" alt="透明设置2">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 14.png" alt="透明设置3">
                    <h3>导入UE材质金属感过强？</h3>
                    <p>ORM贴图关闭SRGB，改为<strong>线性颜色</strong>。</p>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 15.png" alt="ORM设置1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 16.png" alt="ORM设置2">
                    <h3>颜色配置文件/色调映射/TAA</h3>
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 17.png" alt="颜色配置1">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 18.png" alt="颜色配置2">
                    <img loading="lazy" decoding="async" src="/Articles/substance-painter/Untitled 19.png" alt="颜色配置3">
