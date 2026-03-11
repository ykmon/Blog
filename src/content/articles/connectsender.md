---
title: "connect()、sender()"
description: "connect()、sender()"
category: "Article"
date: "2024-04-21"
tags:
  - Article
  - 2026-03-11
---

# Connect()

在 PyQt 中，`**connect**` 函数用于将一个信号（signal）与一个槽（slot）连接起来。信号和槽机制是 PyQt 及其基础库 Qt 的重要特性之一，用于实现事件驱动编程。

- **信号**：信号是 PyQt 中的事件源，通常在某些事件（例如按钮点击、文本变化等）发生时发出。每个 PyQt 部件都有一组信号，可以用来表示不同类型的事件。
- **槽**：槽是一个 Python 函数或方法，用于处理信号。它接收信号发出的参数，并执行相应的操作。
- **连接信号和槽**：`**connect**` 函数将信号和槽关联在一起。当信号被发出时，连接的槽将被自动调用。
例如，如果您想将一个按钮的点击信号（`**clicked**`）与一个函数连接在一起，可以这样做：

```python
button = QPushButton("Click Me")

# 定义一个槽函数
def button_clicked():
    print("Button clicked!")

# 使用 connect 函数将按钮的 clicked 信号与 button_clicked 槽函数连接
button.clicked.connect(button_clicked)
```

在这个示例中，当按钮被点击时，`**button_clicked**` 函数会被调用。

# Sender()

在 PyQt 中，`**sender()**` 函数是一个非常有用的方法，它可以在槽（slot）函数中获取触发该槽的信号的发送者对象。

当一个信号被发出并连接到一个槽时，槽函数可以使用 `**sender()**` 方法来获取信号的发送者对象。这是非常有用的，因为它允许您在同一个槽中处理来自不同发送者的信号，并根据发送者对象执行不同的操作。

下面是一个示例，展示了如何在 PyQt 中使用 `**sender()**` 方法：

```python
pythonCopy code
from PyQt5.QtWidgets import QApplication, QPushButton, QWidget, QVBoxLayout
import sys

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()

        # 创建两个按钮
        button1 = QPushButton("Button 1", self)
        button2 = QPushButton("Button 2", self)

        # 使用布局管理器
        layout = QVBoxLayout(self)
        layout.addWidget(button1)
        layout.addWidget(button2)

        # 将按钮的 clicked 信号连接到槽方法
        button1.clicked.connect(self.button_clicked)
        button2.clicked.connect(self.button_clicked)

    def button_clicked(self):
        # 使用 sender() 方法获取信号的发送者对象
        sender = self.sender()

        # 根据发送者对象执行不同的操作
        if sender.text() == "Button 1":
            print("Button 1 clicked")
        elif sender.text() == "Button 2":
            print("Button 2 clicked")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    widget = MyWidget()
    widget.show()
    sys.exit(app.exec_())


```

在这个示例中，我们创建了一个窗口，包含两个按钮。每个按钮的 `**clicked**` 信号都连接到 `**button_clicked**` 方法。在 `**button_clicked**` 方法中，我们使用 `**self.sender()**` 获取触发信号的发送者对象（在这种情况下是按钮），然后根据按钮的文本进行不同的处理。

`**sender()**` 函数在 PyQt 的信号和槽机制中非常有用，因为它允许您在一个槽中处理多个信号，并根据发送者对象执行特定的操作。