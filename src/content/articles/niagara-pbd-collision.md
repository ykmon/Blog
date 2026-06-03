---
title: "深入浅出 UE5 Niagara：手写 GPU 粒子 PBD 碰撞与空间划分"
description: "在虚幻引擎 Niagara 系统中，利用 PBD 与 Neighbor Grid 3D 实现高性能粒子防穿插。从空间划分、向量数学优化到物理约束稳定性，完整解析 GPU 粒子碰撞求解器。"
category: "Unreal Engine"
date: "2026-06-03"
tags:
  - UE
  - UnrealEngine
  - Shader
  - Code
readTime: "10 Min Read"
---

在虚幻引擎 (UE5) 的 Niagara 系统中，当我们需要让成千上万个 GPU 粒子拥有"体积感"并防止互相穿模时，传统的物理引擎往往会力不从心。这时候，我们需要利用**基于位置的动力学（Position-Based Dynamics, 简称 PBD）**配合**3D 邻居网格（Neighbor Grid 3D）**来手写一个高性能的约束求解器。

本文将拆解一段用于 Niagara Custom HLSL 节点的粒子防穿插代码，从零解析**空间划分、向量数学优化**以及**物理约束的稳定性**。

---

## 1. 完整 HLSL 源码

这段代码通常放在粒子的 `Particle Update` 阶段。它会计算出一个 `outPenetrationOffset`（穿透偏移量），随后你可以将这个向量累加到粒子的 `Position` 上，实现硬约束避让。

```hlsl
// 初始化输出的穿透偏移量
outPenetrationOffset = float3(0.0, 0.0, 0.0);

#if GPU_SIMULATION
// 1. 获取当前粒子在 3D 网格中的坐标信息
float3 UnitPos = float3(0.0, 0.0, 0.0);
inNeighborGrid3D.SimulationToUnit(inPosition, inWorldToUnitMatrix, UnitPos);

int3 CellIndex = int3(0,0,0);
inNeighborGrid3D.UnitToIndex(UnitPos, CellIndex.x, CellIndex.y, CellIndex.z);

int3 NumCells = int3(0,0,0);
inNeighborGrid3D.GetNumCells(NumCells.x, NumCells.y, NumCells.z);

int MaxNeighborsCount = 0;
inNeighborGrid3D.MaxNeighborsPerCell(MaxNeighborsCount);

int CollisionCount = 0;

// 2. 遍历当前粒子所在的网格，以及周围相邻的共计 27 个网格 (3x3x3)
for (int x=-1; x<=1; x++)
{
    for (int y=-1; y<=1; y++) 
    {
        for (int z=-1; z<=1; z++)
        {
            const int3 CellIndexToCheck = CellIndex + int3(x,y,z);

            // 边界检查
            if (CellIndexToCheck.x >= 0 && CellIndexToCheck.x < NumCells.x &&
                CellIndexToCheck.y >= 0 && CellIndexToCheck.y < NumCells.y &&
                CellIndexToCheck.z >= 0 && CellIndexToCheck.z < NumCells.z )
            {
                // 3. 遍历该有效网格内的所有邻居粒子
                for (int i = 0; i < MaxNeighborsCount; i++)
                {
                    int NeighborLinearIndex = 0;
                    inNeighborGrid3D.NeighborGridIndexToLinear(CellIndexToCheck.x, CellIndexToCheck.y, CellIndexToCheck.z, i, NeighborLinearIndex);

                    int NeighborIndex = 0;
                    inNeighborGrid3D.GetParticleNeighbor(NeighborLinearIndex, NeighborIndex);

                    // 剔除无效索引与自身
                    if (NeighborIndex == -1 || NeighborIndex == inExecutionIndex) continue;

                    float3 NeighborPosition = float3(0.0, 0.0, 0.0);
                    bool bNeighborPositionValid = false;
                    inAttributeReader.GetPositionByIndex<Attribute="Position">(NeighborIndex, bNeighborPositionValid, NeighborPosition);
                    
                    if (!bNeighborPositionValid) continue;

                    // 4. 碰撞与距离计算
                    const float3 DeltaPosition = NeighborPosition - inPosition;
                    const float SqrdDistanceToNeighborParticle = dot(DeltaPosition, DeltaPosition);
        
                    // 规避完全重合点，防止除零错误
                    if (SqrdDistanceToNeighborParticle < 0.0001) continue;
                    
                    const float CollisionDistanceThreshold = inParticleCollisionRadius * 2.0;
                    const float CollisionDistanceThresholdSqrd = CollisionDistanceThreshold * CollisionDistanceThreshold;

                    // 检测到重叠（穿透）
                    if (SqrdDistanceToNeighborParticle < CollisionDistanceThresholdSqrd)
                    {
                        const float DistanceToNeighborParticle = sqrt(SqrdDistanceToNeighborParticle);
                        const float3 DirectionToNeighborParticle = DeltaPosition / DistanceToNeighborParticle;
                        
                        CollisionCount++;
                        
                        // 计算穿透深度，乘以 0.5 让双方各承担一半位移
                        const float PenetrationDepth = CollisionDistanceThreshold - DistanceToNeighborParticle;
                        outPenetrationOffset -= DirectionToNeighborParticle * (PenetrationDepth * 0.5);
                    }
                }
            }
        }
    }
}

// 5. 多重碰撞的稳定化处理
if (CollisionCount > 0)
{
    // 求平均偏移量，防止密集状态下引发系统爆炸
    outPenetrationOffset /= CollisionCount;
}
#endif
```

## 2. 核心原理解析

### 🗺️ 空间划分与 3x3x3 邻居遍历

如果场景中有 10,000 个粒子，两两计算距离需要一亿次操作（$O(N^2)$），GPU 会直接宕机。

Niagara 的 `NeighborGrid3D` 通过空间哈希（Spatial Hashing）解决了这个问题：

1. **坐标离散化：** 将连续的物理坐标映射为离散的 3D 数组索引。
2. **解决边界缺陷：** 代码中使用了三层 `for` 循环遍历周围 27 个网格（$3 \times 3 \times 3$）。这是因为如果粒子正好处于网格边界，它可能会漏掉处于相邻网格但物理距离极近的粒子。只要保证**网格边长大于粒子的碰撞直径**，搜索 $3 \times 3 \times 3$ 就能实现完美的无死角检测。

### ⚡ 向量数学与性能榨取

在 GPU 编程中，开方运算 (`sqrt`) 是极其昂贵的。

为了优化性能，代码使用了**点积 (`dot`)** 来计算距离的平方：

$$d^2 = \vec{v} \cdot \vec{v}$$
$$d^2 < (2R)^2$$

通过优先比较"距离的平方"和"阈值的平方"，我们可以快速剔除绝大多数安全的粒子，只有在确认发生碰撞的 `if` 语句内部，才付出代价去计算真正的 `sqrt` 来获取方向向量和穿透深度。

### ⚖️ PBD 物理约束与系统稳定

在 GPU 的高度并行计算中，如果不加限制，物理模拟会极易"爆炸"。代码中有两处关键的"稳定器"：

1. **乘以 `0.5`（防过度补偿）：** 如果粒子 A 和 B 重叠了 10 个单位，它们的线程会同时计算推开逻辑。如果不用 0.5，A 会退 10 步，B 会退 10 步，下一帧它们就拉开了 20 个单位，造成剧烈抖动。乘以 0.5 可以让双方"AA制"，各自承担一半的修正。
2. **除以 `CollisionCount`（雅可比迭代法则）：**
   当一个粒子在粒子堆中心被 6 个邻居同时挤压时，粗暴累加偏移量会赋予它极大的位移，导致粒子堆"爆炸"。除以碰撞次数，相当于取所有建议的"平均折中位置"，能极大提升粒子簇的稳定性。

---

## 3. 进阶探讨：质量不同的粒子怎么相撞？

代码中的 `0.5` 是基于所有粒子"质量相同"的假设。如果粒子大小不一，比如一个保龄球和一个乒乓球相撞，我们需要引入**质量倒数（Inverse Mass）** $w = 1 / m$ 来动态计算推开比例：

$$Ratio = \frac{w_{current}}{w_{current} + w_{neighbor}}$$

在 HLSL 中，这可以写成：

```hlsl
// 动态计算推开系数，轻的粒子承担更多位移，重的粒子如泰山不动
const float PushRatio = InvMassCurrent / (InvMassCurrent + InvMassNeighbor);
outPenetrationOffset += DirectionToNeighborParticle * -(PenetrationDepth * PushRatio);
```
