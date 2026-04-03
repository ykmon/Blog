---
title: "如何编译不同版本插件"
description: "解决 UE5 插件编译报错 Plugin could not be compiled 的完整指南"
category: "Unreal Engine"
date: "2021-11-10"
tags:
  - UE
  - UnrealEngine
  - Code
  - Plugin Development
readTime: "3 Min Read"
image: "/Articles/ue-plugin-compile/cover.jpg"
placeholder: "UE5"
---
![cover](/Articles/ue-plugin-compile/cover.jpg)

<p>在使用各种插件的时候，很多插件可以即插即用，但有一部分插件会提醒你：</p>
<blockquote>
<p><em>The following modules are missing or built with a different engine version.</em></p>
<p><em>Project could not be compiled. Try rebuilding from source manually.</em></p>
</blockquote>
<p>导致报错的原因是因为：<strong>原工程文件在 Plugins 文件夹内手动加入了插件，然后试图将项目在其他设备上运行时将会提示手动加入的插件模块缺失或者构建的引擎版本不同。</strong></p>
<h2>解决方案</h2>
<ol>
<li>
<p><strong>移出报错模块</strong></p>
<p>先把报错的模块从 <code>Plugins</code> 文件夹内移出，在没有其他问题的情况下引擎应该能正常启动。</p>
</li>
<li>
<p><strong>新建C++类</strong></p>
<p>在项目内新建一个 C++ 类，项目将会自动转化为 C++ 工程。</p>
</li>
<li>
<p><strong>删除缓存文件</strong></p>
<p>删除项目中的以下文件夹：</p>
<ul>
<li><code>Binaries</code></li>
<li><code>Saved</code></li>
<li><code>.sln</code></li>
<li><code>Intermediate</code> 文件</li>
</ul>
</li>
<li>
<p><strong>生成 Visual Studio 项目文件</strong></p>
<p>右键 <code>.uproject</code> 文件可以看到 <code>Generate Visual Studio project files</code>，点击生成。</p>
</li>
<li>
<p><strong>重新编译项目</strong></p>
<p>打开 <code>.sln</code> 文件，等待 VS5 就绪，右键 "Game文件" -> "工程名"选项 -> "生成"选项，等待输出栏显示生成成功。</p>
</li>
</ol>
