# 深入浅出 GPU 执行模型：打破 CPU 直觉的并发魔法与 UE 实战

在编写 Shader 或进行 GPU 编程时，我们常常听到“百万线程并发”这样的说法。然而，如果我们带着写 CPU 代码的直觉去理解 GPU，往往会掉入性能优化的陷阱。

在 GPU 的世界里，“线程 (Thread)”并非传统意义上的物理核心。今天，我们就像拆解俄罗斯套娃一样，由内到外、从底层硬件到软件抽象，彻底理清 GPU 的核心架构：**Lanes、Waves、Thread Groups 与 Threads**，并结合一段真实的 Unreal Engine 计算着色器 (Compute Shader) 代码进行逐行解剖。

---

## 1. 最底层的打工人：Lane (通道) 

如果我们把 GPU 渲染比作一个巨大的建筑工地，那么 **Lane (通道)** 就是真正在前线干活的“建筑工人”，它是 GPU 中**最小的执行单元**。

* **专属工作台 (Registers)：** 每个 Lane 都拥有自己极快、但容量极小的专属存储空间——**寄存器**。
* **性能痛点 (Register Pressure)：** 如果我们在代码中声明了过多的局部变量，就会导致寄存器空间被塞满。为了防止数据溢出到极其缓慢的显存 (VRAM) 中，GPU 只能被迫减少同时开工的工人数量。这会严重降低硬件的占用率 (Occupancy)，导致算力闲置。

> **💡 核心法则：** 保护好最底层的片上内存，精简局部变量，是写好 GPU 算法的第一步。

---

## 2. 锁步同行的仪仗队：Wave (波)

单个的 Lane 并不是自由散漫的。硬件会将它们捆绑成一个个小分队，通常是 32 或 64 个 Lane 组成一个 **Wave (波)**。

Wave 的核心特征是 **SIMD (单指令多数据)** 和 **锁步执行 (Lockstep)**。
想象一支 32 人的仪仗队，他们不仅要同时迈步，而且**必须执行完全相同的动作**。他们拿着同一份指令，只是在处理各自寄存器里的不同数据。

### 分支发散 (Divergence) 的代价
因为 Wave 必须“锁步执行”，当代码中出现 `if-else` 分支时，危机就出现了：
1. 假设 Wave 中一半的 Lane 满足 `if` 条件，另一半满足 `else`。
2. GPU 无法让它们同时做不同的动作，只能**轮流执行**。
3. 执行 `if` 时，原本走 `else` 的 Lane 会被强制休眠 (Masking)，原地发呆；反之亦然。

> **⚠️ 性能警告：** Wave 内部的分支发散会严重破坏并发效率。最极端的情况下，如果 32 个 Lane 走向 32 个不同分支，耗时将增加 32 倍，算力利用率跌至 1/32。

---

## 3. 协作即是效率：Thread Group (线程组)

当我们继续向外看，多个 Wave 会被组织成一个 **Thread Group (线程组)**。虽然不同 Wave 之间的执行进度可能不同，但同一个组内的兄弟们拥有强大的协作工具。

### 高速公共桌面：Shared Memory (共享内存)
相比于让每个线程独自去遥远且缓慢的显存 (VRAM) 中拉取数据（容易产生重复搬运），Thread Group 允许大家分工合作，把相邻所需的数据一次性搬入组内专属的 **Shared Memory** 中。这就好比在工地上搭了一个“高速公共桌面”，大家直接从桌上拿材料，速度产生质的飞跃。

### 协作生命线：Synchronization (同步屏障)
有协作就必须有规矩。在大家搬完数据，准备利用 Shared Memory 开始“Do fast work”之前，必须调用同步指令（如 `GroupMemoryBarrierWithGroupSync`）。
它像是一声强制集合哨，要求所有跑得快的线程必须原地等待，直到组内最后一个线程也把数据放好，大家才能共同进入下一步。否则，就会引发灾难性的**数据竞争 (Data Race)**，导致画面错乱。

---

## 4. 宏观的软件蓝图：Threads (线程)

最后，我们回到最外层的概念——**Threads (线程)**。

请记住：**GPU 的线程数不是硬件概念，而是软件抽象。** 它可以被理解为我们规划好的“百万套任务蓝图”。硬件依靠**隐藏延迟 (Latency Hiding)** 机制，在不同线程组之间瞬间切换，从而榨干每一滴算力。

---

## 5. 实战解析：Unreal Engine `.usf` 逐行解剖

理论必须落地。在 Unreal Engine 的日常实战中，编写 Compute Shader 是绕不开的硬核技能。让我们通过一段用于生成圆形遮罩 (Mask) 纹理的真实 `.usf` 代码，来看看上述硬件概念是如何在代码中显现的。

```hlsl
#pragma once
#include "/Engine/Public/Platform.ush"

uint Resolution;
float2 Scale;
float2 Origin;
float2 Location;
float Radius;
RWTexture2D<float> OutTexture;

[numthreads(NUM_THREADS_X, NUM_THREADS_Y, 1)]
void CharacterDot(uint3 DispatchThreadID : SV_DispatchThreadID) 
{
    // 边界检查
    if (DispatchThreadID.x >= Resolution || DispatchThreadID.y >= Resolution)
    {
        return; 
    }
    
    // 计算每个像素的大小与坐标
    const float TexelSize = 1.0 / float(Resolution); 
    const float U = (DispatchThreadID.x + 0.5 * TexelSize);
    const float V = (DispatchThreadID.y + 0.5 * TexelSize);
    
    // 将纹理坐标转换为实际的世界坐标
    const float X = ((U - 0.5) * Scale.x) + Origin.x;
    const float Y = ((V - 0.5) * Scale.y) + Origin.y;
    
    // 计算当前像素与指定位置的距离，并生成遮罩值
    const float Mask = 1.0 - saturate(length(float2(X, Y) - Location) / Radius);
    
    // 写入输出纹理
    OutTexture[DispatchThreadID.xy] = Mask;
}
```

### 概念映射与性能分析

1. **Thread Group 的划分 (`[numthreads(...)]`)**
   代码开头的 `[numthreads(NUM_THREADS_X, NUM_THREADS_Y, 1)]` 直接向 GPU 调度器下达了编组指令。如果宏定义为 `8x8`，那么一个 Thread Group 就包含 64 个线程。这通常是 Wave 大小（32 或 64）的整数倍，以保证硬件完美分配，不留性能空洞。

2. **唯一的派工单 (`SV_DispatchThreadID`)**
   每一次 `CharacterDot` 的执行，都代表底层的一个 **Lane** 在工作。`DispatchThreadID` 是保存在这个工人专属**寄存器**中的全局唯一 3D 坐标。有了它，成千上万并行干活的工人才知道自己究竟该计算哪一个像素。

3. **SIMD 与锁步执行 (数学计算部分)**
   CPU 中的大 `for` 循环，在这里变成了纯并行的数学公式（如求 `U`, `V`, `X`, `Y`）。同一个 **Wave** 里的所有工人，在同一个时钟周期内**同时**执行相同的代码（单指令），只是代入了各自不同的 `DispatchThreadID`（多数据）。

4. **警惕分支发散 (`if` 边界检查)**
   代码中的 `if (DispatchThreadID.x >= Resolution) { return; }` 是典型的危险地带。假设我们要渲染 100x100 的纹理，按 8x8 编组，必然会有多余的线程（比如 X 轴的第 100~103 号线程）超界并触发 `return`。
   **注意：** 触发 `return` 的线程不能立刻下班！因为它们与正常执行的线程被物理绑定在同一个 **Wave** 中锁步执行。它们只能被屏蔽休眠 (Masked)，在原地干等其他兄弟把底下的 `length` 和 `saturate` 算完，造成这部分算力的局部浪费（Divergence）。

5. **显存交互 (`OutTexture[...] = Mask`)**
   最后一步，工人们将结果写回 VRAM 中的纹理。由于这个算法中每个像素的计算都是绝对独立的，不需要“互相抄作业”，因此我们没有使用 Shared Memory 搭建公共桌面，而是直接算完交卷。
