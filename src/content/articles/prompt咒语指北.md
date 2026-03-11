---
title: "Prompt咒语指北"
description: "Prompt咒语指北"
category: "Article"
date: "2023-04-05"
tags:
  - Article
---

# 基本构成

提示词的顺序默认影响最终画面内容的权重，越是靠前的提示词，权重越大

1. 一般在最前方写上关于图片质量的关键词；例如*masterpiece,high quality,Ultra high quality*等等；
1. 然后写一些关于图片主要包含元素的提示词，角色、动作、物品等等，比如说*1girl,1man,black skirt,blue eyes*等等;
1. 再之后写一些不重要的细节，背后的花、衣服的颜色、身边的手机、侧身坐着等等，比如说*headphone,indoors,one side up*等等。
# 权重

由于前面说了Prompt提示词默认顺序影响权重，但是在动则几十上百个提示词之间调整顺序无疑是极为痛苦的，所以在大致顺序的基础上，更为推荐通过括号或中括号的方式来调整权重

SD中括号有两种写法，分别是括号( )和中括号[ ]，括号是增加权重**1.1*，中括号是减少权重**0.9*

```c
(masterpiece)          // 1.1倍权重
((masterpiece))        // 1.1^2=1.21倍权重
(((masterpiece)))      // 1.1^3= 1.331倍权重

[masterpiece]          // 1/1.1倍权重
[[masterpiece]]        // 1/(1.1^2)倍权重
[[[masterpiece]]]      // 1/(1.1^3)倍权重
```

这样写无疑太麻烦了，所以常用的写法是

```c
(masterpiece:1.5)      // 1.5倍权重
[masterpiece:0.5]      // 0.5倍权重
```

# 提示词编辑

## From:to:when

可以在SD生成图像的过程中，基于**采样迭代步数Sampleling steps**调整绘画步骤；即先画A再画B

对于画面表现来说，常用于美术上的“先画主体，再画细节”

```c
// 格式
[from:to:when]         

// example
// when的值如果小于1即为百分数，如果大于1即为具体步数
[mafe:female:0.2]      // 前20%画male，后80%画female
[mafe:female:20]       // 前20步画male，20步之后画female
```

## to:when

可以在SD生成图像的过程中，基于**采样迭代步数Sampleling steps**调整绘画步骤；到某步画某物，前面的内容不参与后面的绘画

```c
// 格式
[to:when]

// example
[flower:0.5]      // 前50%画其余内容，后50%开始画花
```

## from::when

可以在SD生成图像的过程中，基于**采样迭代步数Sampleling steps**调整绘画步骤；前多少步画某物，到该步就停止绘画

```c
// 格式
[from::when]

// example
[flower::0.5]      // 前50%画花，后50%画其余内容
```

## 交替语法

每隔一步进行提示词交换

```c
// 格式
[A|B] other prompts

// example
[cow|cow|horse|man|siberian tiger|ox|man] in a field
```

常用于调整角色发色

## AND提示符

一种允许组合多个提示符的方法，使用大写 AND 组合提示符；与逗号不同的是，因为提示符存在执行顺序，确定执行顺序，而用AND提示符则是将多个提示符放在一个提示位

```c
// example
a cat :1.2 AND a dog AND a penguin :2.2,other prompts
```

总体上来说**"[xx|xx|xx]" 趋向于融合，AND趋向于特征明显的共存。**

## 文本反转 Textual Inversion

文本反转允许用户训练神经网络的一小部分到你自己的图片上，并且在生成新图片时使用结果。

将embeddings放在对应路径中* \embeddings\ *并在Prompt中使用，不必重新启动程序



Prompt示例对比：

也可以使用多个Textual

在使用embeddings时要非常小心，它们在与你配合训练的模型上配合得很好，但切换模型后就不那么好了，例如：

**因此，在使用Textual Inversion时，要特别注意环境是否对齐，检查VAE、Checkpoint、Lora**

## 关键词 Trigger Words

在使用某些lora模型的时候，需要使用官方提供的trigger words作为词缀，用于在**单个lora中准确的导向不同的风格**。

例如：汉服Lora可分为唐代、明代、宋代等等

# 提示词模板保存

可以将常用的内容保存在这里，快速切换多种风格

删除模板方式：找到 sd-package\sytles.csv 通过记事本打开删除，切勿以excel格式打开，会造成UTF-8编码格式错误，可以通过启动器中的**疑难解答**修复