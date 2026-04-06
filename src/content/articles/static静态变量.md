---
title: "static静态变量"
description: "static静态变量"
category: "Game Engine"
date: "2022-10-19"
tags:
  - Code
image: "/Articles/static静态变量/cover.jpg"
---
![cover](/Articles/static静态变量/cover.jpg)


```c++
void AddToCount();

int main() {
	for (int i = 0; i < 100; i++)
	{
		AddToCount();// 从第二次开始调用时赋值为0的初始化全被被忽略了，
									//因为静态变量不能重复初始化
	}

	system("pause");
}


void AddToCount()
{
	static int count = 0;// 静态变量不能重复初始化，与局部变量不同，
												//超出作用域之后还会保留，但不能在作用域外访问，直到程序结束
	count++;
	cout << count << endl;
}
```

static不能在类的内部做初始化，必须用作用域解析符号“双冒号”在类的外部初始化。

在类中用static的好处在于，**它与类中的内容无关，可以不通过实例化直接调用，**（但是可以有对应的实例，即使内部只有一个static）必须用作用域解析符号“双冒号”，因为这样C++才知道你在说什么，变量是存在于它自己的作用域内的，类似于一个命名空间*using namespace std;*。这样就可以用一个类来容纳一堆static静态函数；或者你想创建一个对象的类，但它也也有可以从类外部调用的静态函数或者静态变量，并且静态变量是这个类的所有对象都有的共同点

```c++
class Critter
{
public:
	static int CritterCount;// static不能在类的内部做初始化
	Critter() {
		cout << "A critter is born!\n";
		CritterCount++;
		cout << CritterCount << endl;
	}

	static void AnnounceCount() {
		cout << CritterCount << endl;
	}
private:

};
int Critter::CritterCount = 0;// 初始化static

int main() {
	Critter::CritterCount = 13; // static与类中的内容无关，可以不通过实例化直接调用
	cout << Critter::CritterCount << endl;

	Critter* crit = new Critter;
	Critter::AnnounceCount();
	delete crit;

	//Critter crit; // 创建一个实例化对象
	//crit.CritterCount++;// 更新CritterCount值
	//cout << crit.CritterCount << endl;// 打印出来
	system("pause");
}
```

当上面的代码被编译和执行时，它会产生下列结果：

```c++
13
A critter is born!
14
14
```