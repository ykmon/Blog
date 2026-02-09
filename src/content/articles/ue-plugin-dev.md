---
title: "UE 插件开发笔记：深入剖析 SetSkeletalMeshSectionSettings"
description: "关于 UE5 中修改 SkeletalMesh Section 数据的关键陷阱与解决方案"
category: "Unreal Engine"
date: "2025-01-14"
readTime: "8 Min Read"
placeholder: "CPP"
tags:
  - UE
  - Code
  - Plugin Development
---
<h2>0. 引言</h2>

                    <p>在进行 UE 编辑器工具开发时，我们经常需要通过 C++ 代码批量修改 <code>SkeletalMesh</code> 的设置。本文以一个实际的插件函数

                        <code>SetSkeletalMeshSectionSettings</code> 为例，深入分析如何在编辑器环境下正确修改骨架网格体的 LOD Section 数据。</p>

                    <p>这个函数的主要功能是：</p>

                    <ul>

                        <li>修改指定 LOD Section 的投射阴影和切线计算设置。</li>

                        <li>设置后处理动画蓝图 (Post Process AnimBP) 和 默认 Control Rig。</li>

                        <li><strong>关键点</strong>：解决 UE5 中修改 Section 数据后被重置的问题。</li>

                    </ul>

                    <h2>1. 背景：为什么需要开发 C++ 蓝图函数库？</h2>

                    <p>在 <a href="/articles/ue-python-binding/">UE 学习笔记：从 C++ 到 Python 的函数暴露机制</a> 一文中，我们探讨了 Unreal

                        Engine 如何利用反射系统自动将 C++ 函数暴露给 Python。</p>

                    <p>然而，在实际的 Technical Art (TA) 工具开发中，我们经常会遇到这样的<strong>API 覆盖死角</strong>：</p>

                    <ol>

                        <li><strong>Python API 缺失</strong>：官方的 Python API 虽然覆盖了大量资产管理功能，但对于底层的渲染数据（如 SkeletalMesh 的 LOD

                            Section 详细设置、物理资产约束等）往往没有暴露。</li>

                        <li><strong>Blueprints API 缺失</strong>：很多功能虽然在 C++ 中有（例如

                            <code>USkeletalMesh::GetImportedModel()</code>），但被标记为 <code>WITH_EDITOR_ONLY_DATA</code>

                            或者是内部函数，无法在蓝图中直接调用。</li>

                        <li><strong>C++ 调用门槛高</strong>：直接编写 C++ 逻辑虽然强大，但如果我们只是想在 Python 自动化脚本中修改一个参数，专门为此写一个 C++

                            模块并编译显得过于繁琐。</li>

                    </ol>

                    <p><strong>解决方案：Plugin Blueprint Function Library</strong></p>

                    <p>开发在这个层面的插件本质上是搭建一座桥梁：</p>

                    <ul>

                        <li><strong>向下</strong>：它有权限访问底层的 C++ 接口（如 <code>GetImportedModel</code>）。</li>

                        <li><strong>向上</strong>：通过 <code>UFUNCTION(BlueprintCallable)</code>，它同时成为了 <strong>Native C++

                                API</strong>、<strong>Blueprint 节点</strong> 和 <strong>Python API</strong>。</li>

                    </ul>

                    <p>正如我们要分析的 <code>SetSkeletalMeshSectionSettings</code> 函数，它就是一个典型的例子：它封装了复杂的底层数据同步逻辑（Render Data 与

                        Source Data 的同步），并将其简化为一个可以在 Python 脚本中一行代码调用的函数。</p>

                    <h2>2. 函数定义</h2>

                    <p>首先看头文件中的定义。这是一个仅在编辑器下可用的蓝图函数库静态方法。</p>

                    <pre><code class="language-cpp">// MyBlueprintFunctionLibBPLibrary.h

UFUNCTION(

    BlueprintCallable,

    Category = "SkeletalMesh|Editor",

    meta = (DevelopmentOnly) // 标记为仅开发模式可用

)

static bool SetSkeletalMeshSectionSettings(

    USkeletalMesh* SkeletalMesh,

    int32 LODIndex,

    bool bCastShadow,

    bool bRecomputeTangent,

    TSubclassOf&lt;UAnimInstance&gt; PostProcessAnimBP, // 后处理动画蓝图

    TSoftObjectPtr&lt;UObject&gt; DefaultAnimatingRig // 默认 Control Rig

);</code></pre>

                    <h2>3. 核心实现逻辑</h2>

                    <h3>3.1 获取模型数据</h3>

                    <p>要修改骨架网格体的几何数据，不能直接操作 <code>SkeletalMesh</code>，而是要获取其 <code>ImportedModel</code> (即导入的源数据模型)。</p>

                    <pre><code class="language-cpp">FSkeletalMeshModel* ImportedModel = SkeletalMesh->GetImportedModel();

if (!ImportedModel || !ImportedModel->LODModels.IsValidIndex(LODIndex))

{

    return false;

}

SkeletalMesh->Modify(); // 标记 GC 和 Undo 系统</code></pre>

                    <blockquote>

                        <p><strong>为什么必须操作 ImportedModel？</strong></p>

                        <p>在 Unreal Engine 中，<code>USkeletalMesh</code> 包含两套数据：</p>

                        <ol>

                            <li><strong>Render Data (Runtime Data)</strong>：这是可以直接被 GPU 读取和渲染的数据，为了性能可能会被压缩、裁切或烘焙。</li>

                            <li><strong>Source Data (ImportedModel)</strong>：这是从 FBX/ABC

                                等文件导入的原始几何数据，也就是<strong>源头数据</strong>。</li>

                        </ol>

                        <p><strong>💡 关于 "修改后刷新" 的本质：</strong></p>

                        <p>你在编辑器中遇到的 "修改后需要编译/保存才能看到变化" 的现象，本质上就是 <strong>Source Data 向 Render Data 同步的过程</strong>（即

                            Build 流程）。</p>

                        <ul>

                            <li><strong>编辑阶段</strong>：我们在编辑器里（或者通过 C++ 代码操作 <code>ImportedModel</code>）修改的是

                                <strong>Source Data</strong>。</li>

                            <li><strong>渲染阶段</strong>：GPU 绘制画面时读取的是 <strong>Render Data</strong>。</li>

                            <li><strong>同步（Build）</strong>：<code>SkeletalMesh->Build()</code> 的作用就是把修改后的 Source Data

                                "烘焙" 成新的 Render Data。</li>

                        </ul>

                        <p><strong>结论</strong>：如果只改 Source Data 而不触发 Build，画面不会变；如果只改 Render Data（虽然能暂时看到效果），下次 Build

                            或重启编辑器时，修改就会被源数据覆盖而丢失。所以必须<strong>修改 Source Data 并触发 Build</strong>。</p>

                    </blockquote>

                    <h3>3.2 设置资产属性</h3>

                    <p>一些属性是直接属于 <code>USkeletalMesh</code> 类的，可以直接设置：</p>

                    <pre><code class="language-cpp">SkeletalMesh->SetPostProcessAnimBlueprint(PostProcessAnimBP);

SkeletalMesh->SetDefaultAnimatingRig(DefaultAnimatingRig);</code></pre>

                    <h3>3.3 修改 Section 数据（常规做法）</h3>

                    <p>通常我们会直接获取 <code>LODModel.Sections</code> 并修改其中的结构体数据。</p>

                    <pre><code class="language-cpp">FSkeletalMeshLODModel& LODModel = ImportedModel->LODModels[LODIndex];

FSkelMeshSection& Section0 = LODModel.Sections[0];

Section0.bCastShadow = bCastShadow;

Section0.bRecomputeTangent = bRecomputeTangent;

// 设置切线计算通道

Section0.RecomputeTangentsVertexMaskChannel = bRecomputeTangent ? ESkinVertexColorChannel::Green : ESkinVertexColorChannel::None;</code></pre>

                    <h2>4. KEY POINT：UE5 的 UserSectionsData</h2>

                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">

                        <p class="font-bold text-yellow-700">Warning (CRITICAL)</p>

                        <p>在 UE5 中，仅仅修改 <code>LODModel.Sections</code> 是不够的！</p>

                    </div>

                    <p>UE5 引入了 <code>UserSectionsData</code> 机制，用于存储用户在编辑器界面中覆盖的设置。当调用

                        <code>SkeletalMesh->Build()</code> 时，引擎会优先使用 <code>UserSectionsData</code> 中的数据来重新生成

                        <code>Sections</code>。</p>

                    <p><strong>如果你只修改了 Sections 而忽略了 UserSectionsData，你的修改会在 Build 后被旧数据覆盖。</strong></p>

                    <pre><code class="language-cpp">// =========================================================

// CRITICAL FOR UE5: 同步修改 UserSectionsData (Editor Override Data)

// 如果不修改这里，SkeletalMesh->Build() 时会用这里的旧数据覆盖上面的 Section 数据

// =========================================================

FSkelMeshSourceSectionUserData& UserSectionData0 = LODModel.UserSectionsData[0];

UserSectionData0.bCastShadow = bCastShadow;

UserSectionData0.bRecomputeTangent = bRecomputeTangent;

// 同步切线计算通道设置

if (bRecomputeTangent)

{

    UserSectionData0.RecomputeTangentsVertexMaskChannel = ESkinVertexColorChannel::Green;

}

else

{

    UserSectionData0.RecomputeTangentsVertexMaskChannel = ESkinVertexColorChannel::None;

}</code></pre>

                    <h2>5. 重建与刷新</h2>

                    <p>修改完数据后，必须通知引擎进行重建和刷新，否则更改不会生效或无法保存。</p>

                    <pre><code class="language-cpp">// 1. 使缓存失效

SkeletalMesh->InvalidateDeriveDataCacheGUID();

// 2. 触发布局刷新 (某些情况下需要强制刷新 LODInfo 的 Hash)

SkeletalMesh->PostEditChange();

// 3. 强制重建渲染数据

SkeletalMesh->Build();

// 4. 标记包脏（需要保存）

SkeletalMesh->MarkPackageDirty();</code></pre>

                    <h2>6. 总结</h2>

                    <p>这个函数展示了 UE C++ 开发中一个非常典型的问题：<strong>编辑器显示的数据与底层渲染数据之间的同步</strong>。</p>

                    <ol>

                        <li><strong>操作源数据</strong>：始终通过 <code>GetImportedModel()</code> 操作。</li>

                        <li><strong>双重修改</strong>：在 UE5 中需同时修改 <code>Sections</code> 和 <code>UserSectionsData</code>

                            (Editor Override Data)。

                        </li>

                        <li><strong>完整刷新</strong>：必须正确调用 Build 和 PostEditChange 流程。</li>

                    </ol>
