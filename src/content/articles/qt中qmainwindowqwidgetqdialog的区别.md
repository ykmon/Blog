---
title: "Qt中QMainWindow、QWidget、QDialog的区别"
description: "Qt中QMainWindow、QWidget、QDialog的区别"
category: "Houdini"
date: "2024-04-14"
tags:
  - Automation
  - AI
  - Houdini
  - Others DCC
image: "/Articles/qt中qmainwindowqwidgetqdialog的区别/cover.jpg"
---
![cover](/Articles/qt中qmainwindowqwidgetqdialog的区别/cover.jpg)


**QMainWindow **类提供一个有菜单条、锚接窗口（例如工具条）和一个状态条的主应用程序窗口。 主窗口通常用在提供一个大的中央窗口部件（例如文本编辑或者绘制画布）以及周围菜单、工具条和一个状态条。QMainWindow常常被继承，因为这使得封装中央部件、菜单和工具条以及窗口状态条变得更容易，当用户点击菜单项或者工具条按钮时，槽会被调用。

**QWidget**类是所有用户界面对象的基类。 窗口部件是用户界面的一个基本单元：它从窗口系统接收鼠标、键盘和其它事件，并且在屏幕上绘制自己。每一个窗口部件都是矩形的，并且它们按Z轴顺序排列。一个窗口部件可以被它的父窗口部件或者它前面的窗口部件盖住一部分。

**QDialog **是最普通的顶级窗口。 一个不会被嵌入到父窗口部件的窗口部件叫做顶级窗口部件。通常情况下，顶级窗口部件是有框架和标题栏的窗口（尽管使用了一定的窗口部件标记，创建顶级窗口部件时也可能没有这些装饰。）在Qt中，QMainWindow和不同的QDialog的子类是最普通的顶级窗口

**选用原则**
如果是主窗体，则基于QMainWindow创建。
如果是顶级对话框，则基于QDialog创建。
如果需要嵌入到其他窗体中，则基于QWidget创建
如果不确定，或者1 2两种情况都有，那么，就选择QWidget。