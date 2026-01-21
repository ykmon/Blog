# Houdini 中绕过 Qt UI，直接调用 Python 逻辑

> 系统学习笔记 | 适用于 Pipeline 自动化、批量资产处理、hython / Headless 环境

---

## 问题背景

在 Houdini 的实际生产中，尤其是 **KineFX**、**Rig**、**Animation** 相关节点，大量参数按钮在点击后会弹出 Qt Dialog，例如：

- `Update From Input`
- `Bake`
- `Select Channels`

这些按钮在交互式操作中没有问题，但在以下场景会成为阻碍：

| 场景 | 问题 |
|------|------|
| Pipeline 自动化 | 无法人工点击按钮 |
| 批量资产处理 | 弹窗阻断流程 |
| hython / Headless 环境 | 根本没有 UI |
| 技术美术工具开发 | 需要稳定可控的 API |

### 核心困惑

> Houdini 节点按钮强依赖 Qt UI，那么在 **没有 Qt UI 的情况下**，是否还能执行按钮背后的功能？

**答案是：不仅可以，而且这是更高级、也更正确的用法。**

---

## 按钮在 Houdini 中的真实角色

在 Houdini 中，参数面板里的 **Button Parm** 并不是"逻辑本身"，而只是一个 **入口**。

从本质上看，调用链是这样的：

```
Button Parm → 触发回调 → 打开 Qt Dialog → 收集用户输入 → 执行真正的 Python 逻辑
```

也就是说：

> - **按钮 ≠ 逻辑**
> - **Qt Dialog ≠ 必需**

一个典型的按钮回调通常是这样的：

```python
def showBakeDialog(kwargs):
    return blendshapebakingdialog.showBakeDialog(kwargs)
```

这段代码本身并不处理任何数据，只是负责**显示 UI**。

---

## Houdini Qt Dialog 的通用结构模型

几乎所有 Houdini 自带 Qt Dialog 都遵循同一种结构：

```
Button Parm
 └── Callback
      └── showDialog()
            └── Qt Dialog（QDialog）
                  ├── UI 控件（QCheckBox / QLineEdit / ComboBox）
                  └── 核心 Python 逻辑函数  ← 真正干活的部分
```

**真正"干活"的部分，一定在 Dialog 类的某个方法中，而不是在按钮本身。**

因此，正确的思路是：

```
定位 Dialog 类 → 找到真正执行逻辑的方法 → 直接调用它
```

---

## 实战案例：KineFX BlendShape 的 Update From Input

以 KineFX 的 `characterblendshapechannels` 节点为例。

按钮 `Update From Input` 会弹出一个 Qt Dialog，对应源码位于：

```
$HFS/packages/kinefx/python3.11libs/kinefx/ui/blendshapebakingdialog.py
```

在该文件中可以看到：

```python
class BakeDialog(QtWidgets.QDialog):
```

UI 上的 `Update` 按钮仅仅绑定了：

```python
self.updateButton.clicked.connect(self.updateFromInput)
```

而真正执行逻辑的，是这个方法本身：

```python
def updateFromInput(self):
    ...
```

### 关键认知点

> UI 按钮只是调用了 `updateFromInput()`，那么我们完全可以**直接调用它**。

---

## 绕过 Qt UI 的标准做法

正确、稳定、可自动化的写法如下：

```python
from kinefx.ui import blendshapebakingdialog

# 实例化 Dialog（不显示）
dialog = blendshapebakingdialog.BakeDialog()

# 注入节点上下文
dialog.setNode(bs_channels_node)

# 不 show、不 exec，直接调用核心逻辑
dialog.updateFromInput()
```

在这个过程中：

| 不需要 | 原因 |
|--------|------|
| `dialog.show()` | 不需要显示窗口 |
| `dialog.exec_()` | 不需要进入事件循环 |
| Qt 事件循环 | 逻辑与 UI 解耦 |
| Houdini UI 可用 | 纯 Python 调用 |

---

## 为什么这种方式是安全且合理的

Qt Dialog 在 Houdini 中的真实职责只有两点：

1. **保存 UI 状态**（勾选框、输入框、下拉框）
2. **将这些状态传递给逻辑函数**

而 `updateFromInput()` 内部使用的都是：

- `hou.Node`
- `hou.Geometry`
- `hou.Parm`
- 数据读写与计算逻辑

这些内容与 Qt UI 是否存在**完全无关**。

> **Qt Dialog 是"外壳"，Python 方法才是"引擎"。**

---

## 在没有 UI 的情况下如何控制参数行为

即使不显示 UI，Dialog 内部的控件对象依然存在，它们只是普通的 Python 对象。

因此可以直接设置它们的状态：

```python
dialog.updateValuesToggle.setChecked(True)
dialog.fromFrameRangeToggle.setChecked(False)
dialog.blendshapeGroup.setText("*")
```

这本质上等价于：

> **用 Python 模拟用户在 UI 中的勾选与输入。**

---

## 通用化总结：适用于所有 Houdini Qt Dialog

不论是 KineFX、Rig、Animation 还是其他模块，绕过 Qt 的通用模式始终一致：

```python
# 1. 找到 Dialog 所在模块
from some.module import SomeDialog

# 2. 实例化 Dialog（不显示）
dlg = SomeDialog()

# 3. 注入必要上下文（node / kwargs）
dlg.setNode(node)

# 4. 设置 UI 状态（可选）
dlg.someToggle.setChecked(True)

# 5. 直接调用真正的逻辑方法
dlg.doSomething()
```

---

## 常见错误方式（反模式）

以下写法在自动化场景中是**强烈不推荐**的：

```python
# ❌ 错误示例
node.parm("updatefrominput").pressButton()
```

| 问题 | 说明 |
|------|------|
| 强依赖 Qt UI | 需要 UI 环境 |
| 无法精确控制参数 | 只能触发默认行为 |
| hython / Server 环境不可用 | 无头模式直接失败 |
| 不稳定、不可扩展 | 难以集成进 Pipeline |

---

## 核心结论

在 Houdini 中：

> **任何会弹出 Qt UI 的按钮，都不应该被当作"必须的操作步骤"，而应被视为"Python 逻辑的入口"。**

真正工程化、可复用、可自动化的 Houdini Python 用法是：

| 原则 | 做法 |
|------|------|
| ❌ 不点按钮 | 避免 `pressButton()` |
| ❌ 不弹 UI | 不调用 `show()` / `exec_()` |
| ✅ 直接调用逻辑 | 找到并调用核心方法 |

---

## 延伸阅读

- Houdini Python API 文档
- Qt for Python (PySide2/PySide6) 官方文档
- Houdini 源码路径：`$HFS/houdini/python3.xlibs/`

---

*本文档基于 Houdini 实际生产经验整理，适用于 TD / Pipeline / 技术美术开发场景。*
