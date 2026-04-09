---
title: "ArrayList集合"
description: "ArrayList集合"
category: "Game Engine"
date: "2022-08-06"
tags:
  - Code
image: "/Articles/arraylist集合/cover.jpg"
---
![cover](/Articles/arraylist集合/cover.jpg)


概念：很多数据的一个集合

数组的缺点：长度固定，类型单一；

集合的有点：长度可变，类型随意。

可以把集合看作“长度可变的，具有很多方法的数组”

```c#
ArrayList.Add():添加单个元素
ArrayList.AddRange():添加集合元素
ArrayList.Clear():清空所有元素
ArrayList.Remove():删除单个元素，想删除谁就把谁放进去
ArrayList.RemoveAt():根据下标删除元素
ArrayList.RemoveRange()：根据下标去移除一定范围的元素
ArrayList.Sort()：升序排列
ArrayList.Reveerse()：反转
ArrayList.Insert():在指定位置插入单个元素
ArrayList.InsertRange():在指定的位置插入一个集合
ArrayList..Contains():判断是否包含

list.Count;//集合中实际包含元素的个数
list.Capcity;//集合中可以包含元素的个数

int[] number = list.ToArray();//泛型集合能转换成数组
List<int> listTwo = number.ToList();//数组也能转成泛型集合，可以互相转换
```

## 集合长度问题：

Count：表示这个集合中实际包含的元素的个数；

Capcity：表示这个集合中可以包含元素的个数。

每次集合中实际包含的元素个数（count）超过了可以包含的元素的个数（capcity）的时候，集合就会向内存中申请多开辟一倍的空间，来保证集合的长度一只够用。

## 泛型集合

```c#
//泛型集合
            List<int> list = new List<int>();//不要忘记小括号
            list.Add(1);
            list.AddRange(new int[] { 2,3,4,5 });

            int[] number = list.ToArray();//泛型集合能转换成数组
            List<int> listTwo = number.ToList();//数组也能转成泛型集合，互相转换
            for (int i = 0; i < list.Count; i++)
            {
                Console.WriteLine(list[i]);
            }
            Console.ReadKey();
```
