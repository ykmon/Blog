---
title: "Lora"
description: "Lora"
category: "Article"
date: "2023-04-05"
tags:
  - Article
  - 2026-03-11
---

# 什么是Lora？

Lora模型是一个可以通过少量图片训练的小模型，可以和大模型Checkpoint结合使用，干涉大模型产生的结果，帮助达到一个更想要的效果

Lora模型大致分为两类；一类为***角色***类模型，例如欧美脸、中国脸、胡桃脸……，另一类为***风格***类模型，如各种姿势、造型、服装、发型……

# 存放路径

SD默认使用盘符：\sd_package\stable-diffusion-webui\models\Lora\

Lora插件使用盘符：\sd_package\extensions\stable-diffusion-additional-networks\models\Lora\

# 如何使用

## 演示

我们先不使用Lora来测试一下

接下来我们加入间谍过家家的Lora来进行一定的干涉

这就是Lora的作用，能够为我们的模型产生更精准的引导和影响

我们注意看一下Prompt，额外增加了一串Lora字符串**<lora:yorBriarSpyFamily_lykonV1:1>**

该字符串的意思为<Lora：Lora文件名：权重>，要注意，Lora文件必须保存在本地，也就是存放路径 

## 权重

要注意的是，权重并不是越高越好，每一个Lora在不同模型Checkpoint下的权重，需要在实践中根据自己的喜好进行微调；一般为0.8

## 叠加使用

可以在Prompt中按照单独使用的Lora字符串后再增加一个字符串来使多个Lora来影响同一个模型Checkpoint

例如：

((masterpiece,best quality))1girl, solo, black skirt, blue eyes, electric guitar, guitar, headphones, holding, holding plectrum, instrument, long hair, , music, one side up, pink hair, playing guiter, pleated skirt, black shirt, indoors, ((masterpiece,best quality))1girl, solo, black skirt, blue eyes, electric guitar, guitar, headphones, holding, holding plectrum, instrument, long hair, , music, one side up, pink hair, playing guiter, pleated skirt, black shirt, indoors**<lora:yorBriarSpyFamily_lykonV1:0.7><lora:chracterYukino_V10:0.9>**