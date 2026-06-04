---
title: "通过QtDesniger创建视口并导入Houdini"
description: "通过QtDesniger创建视口并导入Houdini"
category: "Houdini / Tool"
date: "2024-04-14"
icon: "▣"
tags:
  - Houdini
---

# 创建视窗

1. 打开QtDesniger，选择Widget，创建默认视窗，右边的属性栏能自定义各种属性
1. 保存文件
# 添加文件

创建文件UWindow.py

```python
import sys, hou
from PySide2.QtWidgets import *
from PySide2.QtGui import *
from PySide2.QtCore import *
from PySide2.QtUiTools import QUiLoader

class HoudiniUWindow(QWidget):

    def __init__(self):
        super(HoudiniUWindow, self).__init__()

        #加载刚才保存文件的路径
        ui = QUiLoader().load(r"H:\OneDrive\python\QtForHoudini\Ykmon_Tools\UI_Files\Example.ui")

        mainlayout = QVBoxLayout()
        mainlayout.setContentsMargins(0,0,0,0)  #设置self容器边框
				mainlayout.addWidget(ui)                #添加控件

        self.setLayout(mainlayout)
        self.setWindowTitle("Ykmon Tools")
        self.setMinimumSize(600, 400)
        self.resize(600, 400)
#这段注释的取消后，再注释掉def show() 即可直接在IDE中运行检查窗口，如果要进入Houdini，记得还原回来
#if __name__ ==  "__main__":         #习惯用法，用于检查脚本是否作为主程序执行。在这个条件下的代码块只会在脚本被直接执行时运行，而不是被其他脚本导入时运行。
#    app = QApplication(sys.argv)    #PyQt 库的应用程序对象，负责处理应用程序的事件循环和管理应用程序的资源。
#    win = HoudiniUWindow()          #自定义的窗口类，包含窗口的布局和功能
#    win.show()                      #显示窗口
#    app.exec_()                     #执行

def show():
    win = HoudiniUWindow()                          #自定义的窗口类，包含窗口的布局和功能
    win.setParent(hou.qt.mainWindow(), Qt.Window)   #设置父窗口为houdini的窗口，默认是Windows的窗口
    win.show()                                      #显示窗口

```

其中要注意的是，我们所创建的QWidget并不是最大单元，在其之上还有一个容器self，很多时候，窗口的尺寸、颜色、标题等属性与预想的效果不对，往往是这个最self的属性需要调整，比如：

```python
mainlayout.setContentsMargins(0,0,0,0)  #设置self容器边框
```

这段code基本属于标准起手，其中较为难以理解的部分主要是`**super()**`和`**QVBoxLayout()**` 

# super()

在 PyQt 中，`**super()**` 函数用于调用父类的方法，可以在子类中使用 `**super()**` 来调用父类的构造函数或其他方法。

通常情况下，当你需要在子类中扩展父类的功能时，你可能会重写父类的方法。在子类中重写方法时，你可能需要在子类的方法中调用父类的同名方法，以确保父类的行为仍然得到执行。这时就可以使用 `**super()**` 函数。

例如，在 PyQt 中，如果你创建了一个子类继承自 `**QWidget**`，并且你想要扩展 `**QWidget**` 的构造函数以添加一些额外的初始化步骤，你可以这样做：

```python
pythonCopy code
from PySide2.QtWidgets import QWidget

class MyWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)  # 调用父类的构造函数
        # 执行额外的初始化步骤
        # ...
```

在这个例子中，`**super().__init__(parent)**` 调用了父类 `**QWidget**` 的构造函数，确保了父类的初始化工作得以执行，然后你可以在子类中添加额外的初始化步骤。如：

```python
self.setLayout(mainlayout)
self.setWindowTitle("Ykmon Tools")
self.setMinimumSize(600, 400)
self.resize(600, 400)
```

# QVBoxLayout()

`**QVBoxLayout**` 是 PyQt 中的垂直布局管理器类。垂直布局管理器用于将部件垂直排列，即从上到下依次排列，类似于水平方向的列。在使用 `**QVBoxLayout**` 布局管理器时，你可以将部件添加到布局中，然后布局会自动安排这些部件的位置和大小。

例如，如果你创建了一个 `**QVBoxLayout**` 对象，并向其中添加了两个按钮部件，那么这两个按钮将会垂直排列，一个在另一个的下方。当窗口大小改变时，布局管理器会自动调整按钮的位置和大小，以适应窗口的变化。

下面是一个简单的示例，演示了如何使用 `**QVBoxLayout**` 将两个按钮垂直排列：

```python
pythonCopy code
import sys
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        # 创建垂直布局管理器
        vbox = QVBoxLayout()

        # 创建两个按钮部件
        button1 = QPushButton('Button 1')
        button2 = QPushButton('Button 2')

        # 将按钮部件添加到垂直布局管理器中
        vbox.addWidget(button1)
        vbox.addWidget(button2)

        # 将布局管理器设置为窗口的布局
        self.setLayout(vbox)

        self.setWindowTitle('Vertical Layout Example')
        self.setGeometry(100, 100, 300, 200)
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyWidget()
    sys.exit(app.exec_())


```

在这个示例中，我们创建了一个名为 `**MyWidget**` 的窗口类，其中包含两个按钮部件，并使用 `**QVBoxLayout**` 将它们垂直排列在一起。
