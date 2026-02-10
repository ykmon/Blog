---
title: "UE 学习笔记：从 C++ 到 Python 的函数暴露机制"
description: "深入理解UE反射系统如何自动生成Python绑定"
category: "Unreal Engine"
date: "2025-01-12"
readTime: "6 Min Read"
placeholder: "UE5"
tags:
  - UE
  - Code
  - Automation
---

## 0. 工程版本

Unreal 5.7.1

## 1. 核心概念

在 Unreal Engine 中，Python API 并非通过手动编写绑定代码一一实现的，而是利用了 UE 强大的 **反射系统 (Reflection System)**。

只要一个 C++ 函数满足以下条件，引擎就会自动为它生成 Python 绑定：

1. 类继承自 `UBlueprintFunctionLibrary`（通常用于静态工具函数）。
2. 函数被 `UFUNCTION(BlueprintCallable)` 宏标记。
3. 函数是 `static` 的（对于工具库而言）。

## 2. 实例分析：ImportSkeletalMeshDNA

我们以 `RigLogic` 插件中的导入功能为例，展示这一机制是如何工作的。

### 2.1 C++ 定义 (Header)

在 `RigLogicEditor\Public\DNAImporterLibrary.h` 中：

```cpp
#include "Kismet/BlueprintFunctionLibrary.h"
#include "DNAImporterLibrary.generated.h"
UCLASS(MinimalAPI)
class UDNAImporterLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()
    // 关键宏：BlueprintCallable 使其对脚本可见
    UFUNCTION(CallInEditor, BlueprintCallable, meta = (DisplayName = "Import Skeletal Mesh DNA File"), Category = "DNA")
    static UE_API void ImportSkeletalMeshDNA(const FString FileName, UObject* Mesh);
};
```

**关键点解析：**

- `UBlueprintFunctionLibrary`：这是所有静态工具库函数的基类。
- `BlueprintCallable`：这个说明符告诉 Unreal Header Tool (UHT)，该函数需要在蓝图（以及 Python）中可被调用。
- `static`：静态函数在 Python 中会作为类方法调用，或者有时候作为模块级函数暴露。

### 2.2 Python 调用

引擎启动时，反射系统会扫描所有 `UCLASS` 和 `UFUNCTION`，并按照 **蛇形命名法 (Snake Case)** 自动生成 Python 接口。

C++ 中的 `ImportSkeletalMeshDNA` 会自动变为 Python 中的 `import_skeletal_mesh_dna`。

```python
import unreal
# 1. 准备参数
dna_file = "D:/Assets/MetaHuman.dna"     # 对应 C++: const FString FileName
skel_mesh = unreal.load_asset(...)       # 对应 C++: UObject* Mesh
# 2. 调用函数
# 类名保持不变：UDNAImporterLibrary -> unreal.DNAImporterLibrary
# 函数名变蛇形：ImportSkeletalMeshDNA -> import_skeletal_mesh_dna
unreal.DNAImporterLibrary.import_skeletal_mesh_dna(dna_file, skel_mesh)
```

## 3. 类型映射规则

UE 会自动处理常见类型的转换，让你在 Python 中感觉像是在写原生代码：

| C++ 类型 | Python 类型 | 说明 |
|---|---|---|
| `FString`, `FName`, `FText` | `str` | 字符串自动转换 |
| `int32`, `float`, `bool` | `int`, `float`, `bool` | 基础类型直接映射 |
| `UObject*` (及子类) | `unreal.Object` | 传递对象引用 |
| `TArray<T>` | `unreal.Array` (或 list) | 数组映射 |
| `const T&` (输入参数) | 值类型 | 输入参数通常按值传递 |
| `T&` (非 const, 输出参数) | 返回值 (tuple) | C++ 的引用输出参数在 Python 中通常变为函数的返回值 |

## 4. 总结

当看到一个 Python 里的 `unreal.SomeClass.some_function` 时，想知道它是哪里来的：

1. **去 C++ 工程里搜**：去掉下划线，搜 `SomeFunction`。
2. **找宏**：确认它是否有 `UFUNCTION(BlueprintCallable)`。
3. **看参数**：Python 传参通常直接对应 C++ 的函数签名。

这种机制极大地简化了自动化工具的开发，只需写一套 C++ 代码，蓝图和 Python 就都能直接复用。
