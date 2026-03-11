---
title: "第3章 Unity Shader基础"
description: "第3章 Unity Shader基础"
category: "Shader"
date: "2022-04-27"
tags:
  - Shader
  - 2026-03-11
---

# 概述

Unity 中我 需要配合使用 材质 (Materia l) Unity Shader 能达到需要
果。一个最常见的流程是
(1)  创建一个材质；
(2)  创建一个Unity Shader, 并把它赋给上一步中创建的材质；
(3)  把材质赋给要渲染的对象；
(4)  在材质面板中调整 Unity Shader得属性，以得到满意的效果。

可以发现， Unity Shader 定义了渲染所需的各种代码（如顶点着色器和片元着色器） 、属性（ 如
使用哪些纹理等）和指令（渲染和标签设置等），而材质则允许我们调节这些属性， 并将其最终赋给相应的模型。

# 材质和Unity Shader 的桥梁Properties

Properties 语义块的定义通常如下：

```c++
Properties {
Name ("display name", PropertyType) = DefaultValue
Name ("display name", PropertyType) = DefaultValue
／／更多属性
}
```

开发者们声明这些属性是为了在材质面板中能够方便地调整各种材质属性。如果我们需要在
Shader 中访问它们，就需要使用每个属性的名字(Name) 。在Unity 中，这些属性的名字通常由
一个下划线开始。显示的名称(display name) 则是出现在材质面板上的名字。我们需要为每个
属性指定它的类型(Property Type) , 常见的属性类型如表3. 1 所示。除此之外，我们还需要为每
个属性指定一个默认值，在我们第一次把该Unity Shader 赋给某个材质时，材质面板上显示的就
是这些默认值。

需要说明的是，即使我们不在Properties 语义块中声明这些属性，也可以直接在CG 代码片中定义变量。此时，我们可以通过脚本向Shader 中传递这些屈性。Properties 语义块的作用仅仅是为了让这些属性可以出现在材质面板中。

## 重量级成员:SubShader

每一个UnityShader文件可以包含多个SubShader语义块，但最少要有一个。当Unity需要加载这个Unity Shader时，Unity会扫描所有的SubShader语义块， 然后选择第一个能够在目标平台上运行的SubShader。如果都不支持的话， Unity就会使用Fallback语义指定的Unity Shader。

Unity提供这种语义的原因在于， 不同的显卡具有不同的能力。

SubShader语义块中包含的定义通常如下；

```c++
SubShader {
		／／可选的
		[Tags]
		／／可选的
		[RenderSetup)
		Pass {
		}
		// Other Passes
}
```

SubShader中定义了一系列Pass以及可选的状态([Render Setup])和标签([Tags])设置。每个Pass定义了一次完整的渲染流程， 但如果Pass的数目过多， 往往会造成渲染性能的下降。因此， 我们应尽量使用最小数目的Pass。

### 状态设置

Shader Lab提供了一系列渲染状态的设置指令， 这些指令可以设置显卡的各种状态， 例如是否开启混合I深度测试等。表3.2给出了ShaderLab中常见的渲染状态设置选项。

当在SubShader块中设置了上述渲染状态时，将会应用到所有的Pass。如果我们不想这样（例
如在双面渲染中， 我们希望在第一个Pass中剔除正面来对背面进行渲染， 在第二个Pass中剔除
背面来对正面进行渲染）， 可以在Pass语义块中单独进行上面的设置。

### SubShader的标签

SubShader的**标签(Tags)**是一个**键值对(Key/Value Pair)**, 它的键和值都是字符串类型。这些键值对是SubShader和渲染引擎之间的沟通桥梁。 它们用来告诉Unity的渲染引擎：我希望怎样以及何时渲染这个对象。

标签的结构如下：

```c++
Tags { " TagNamel " = "Valuel " "TagName2" = "Value2 " J
```

SubShader的标签块支待的标签类型如表3 .3 所示。

需要注意的是，上述标签仅可以在SubShader 中声明，而不可以在Pass 块中声明。Pass 块虽
然也可以定义标签，但这些标签是不同千SubShader 的标签类型。

### Pass 语义块

Pass 语义块包含的语义如下：

```c++
Pass {
		[Name]
		[Tags]
		[RenderSetup]
		// Other code
}
```

我们可以对Pass 设置渲染状态。SubShader 的状态设置同样适用于Pass 。除了上面提到的状态设置外，在Pass 中我们还可以使用固定管线的着色器命令。

Pass 同样可以设置标签， 但它的标签不同于SubShader 的标签。这些标签也是用千告诉渲染引擎我们希望怎样来渲染该物休。表3.4 给出了Pass 中使用的标签类型。

除了上面普通的Pass 定义外， Unity Shader 还支持一些特殊的Pass, 以便进行代码复用或实现更复杂的效果。

**UsePass**: 如我们之前提到的一样，可以使用该命令来复用其他Unity Shader 中的Pass；

**GrabPass**: 该Pass 负责抓取屏称并将结果存储在一张纹理中，以用于后续的Pass 处理。

## 留—条后路Fallback

紧跟在各个SubShader 语义块后面的，可以是一个Fallback 指令。它用于告诉Unity, "如果上面所有的SubShader 在这块显卡上都不能运行，那么就使用这个最低级的Shader 吧！”

它的语义如下：

```c++
Fallback "name"
//或者
Fallback off
```

我们也可以任性地关闭Fallback 功能，但一旦你这么做，你的意思大概就是：“如果一块显卡跑不了上面所有的SubShader, 那就不要管它了！”

下面给出了一个使用Fallback 语句的例子：

```c++
Fallback "VertexLit"
```

事实上， Fallback 还会影响阴影的投射。在渲染阴影纹理时， Unity 会在每个Unity Shader 中寻找一个阴影投射的Pass 。通常情况下，我们不需要自己专门实现一个Pass, 这是因为Fallback使用的内置Shader 中包含了这样一个通用的Pass。因此，为每个Unity Shader 正确设立Fallback是非常重要的。

# Unity Shader 的形式

在上面，我们讲了Unity Shader 文件的结构以及ShaderLab 的语法。尽管Unity Shader 可以做的事情非常多（例如设置渲染状态等），但其最重要的任务还是指定各种着色器所需的代码。这些着色器代码可以写在SubShader 语义块中（表面着色器的做法） ，也可以写在Pass 语义块中（顶点/片元着色器和固定函数着色器的做法）。

在Unity 中，我们可以使用下面3 种形式来编写Unity Shader。而不管使用哪种形式， 真正意义上的Shader 代码都需要包含在ShaderLab 语义块中，如下所示：

```c++
Shader "MyShader" {
		Properties {
				//所需的各种属性
		}
		SubShader {
				//真正意义上的Shader 代码会出现在这里
				//表面着色器(Surface Shader) 或者
				//顶点／片元着色器(Vertex/Fragment Shader) 或者
				//固定函数着色器(Fixed Function Shader)
		}
		SubShader {
				//和上一个SubShader类似
		}
}
```

## Unity的宠儿:表面着色器

表面着色器(Surface Shader) 是Unity 自己创造的一种着色器代码类型。它需要的代码量很少， Unity 在背后做了很多工作，但渲染的代价比较大。它在本质上和下面要讲到的顶点／片元巷色器是一样的。

当给Unity 提供一个表面着色器的时候，它在背后仍旧把它转换成对应的顶点／片元着色器。

一个非常简单的表面着色器示例代码如下：

```c++
Shader "Custom/Simple Surface Shader" (
		SubShader (
				}
				Tags ( "RenderType" = "Opaque" I
				CGPROGRAM
				#pragma surface surf Lambert
				struct Input｛
						float4 color : COLOR;
				};
				void surf (Input IN, inout SurfaceOutput o) (
						o.Albedo = l;
				}
				ENDCG
		Fallback "Diffuse "
}
```

从上述程序中可以看出，表面着色器被定义在SubShader 语义块（而非Pass 语义块）中的CGPROGRAM 和ENDCG 之间。原因是，表而着色器不需要开发者关心使用多少个Pass、每个Pass 如何渲染等问题，Unity会在背后为我们做好这些事情

CGPROGRAM 和ENDCG 之间的代码是使用CG/HLSL 编写的，也就是说，我们需要把CG/HLSL 语言嵌套在ShaderLab 语言中。

## 最聪明的孩子:顶点／片元着色器

在Unity 中我们可以使用CG/HLSL 语言来编写顶点／片元着色器(Vertex/Fragment Shader) 。它们更加复杂，但灵活性也更高。

一个非常简单的顶点／片元着色器示例代码如下：

```c++
Shader "Custom/Simple VertexFragment Shader" {
SubShader {
		Pass {
				CGPROGRAM

				#pragma vertex vert
				#pragma fragment frag

				float4 vert(float4 V: POSITION) : SV_ POSITION {
						return mul (UNITY_ MATRIX_ MVP，v) ;
				}

				fixed4 frag() : SV_ _Target {
						return fixed4(1.0,0.0,0.0,1.0);
				}

				ENDCG
		}
}
```

和表面着色器类似， 顶点／片元着色器的代码也需要定义在CGPROGRAM 和ENDCG 之间，但不同的是， 顶点／片元着色器是写在Pass 语义块内，而非SubShader 内的。原因是，我们需要自已定义每个Pass 需要使用的Shader 代码。虽然我们可能需要编写更多的代码，但带来的好处是灵活性很高。

## 选择哪种Unity Shader 形式

那么，我们究竟选择哪一种来进行Unity Shader 的编写呢？这里给出了一些建议。
• 除非你有非常明确的需求必须要使用固定函数着色器，例如需要在非常旧的设备上运行你
的游戏（这些设备非常少见），否则请使用可编程管线的着色器，即表面着色器或顶点／
片元着色器。
• 如果你想和各种光源打交道，你可能更喜欢使用表面着色器，但需要小心它在移动平台的
性能表现。
• 如果你需要使用的光照数目非常少，例如只有一个平行光，那么使用顶点／片元着色器是
一个更好的选择。
• 最重要的是，如果你有很多自定义的渲染效果，那么请选择顶点／片元着色器。

# 答疑解惑

## Unity Shader ! =真正的Shader

需要读者注意的是， Unity Shader 并不等同于第2 章中所讲的Shader, 尽管Unity Shader 翻译过来就是Unity 着色器。在Unity 里， Unity Shader 实际上指的就是一个ShaderLab 文件——硬盘上以.shader 作为文件后缀的一种文件。

在Unity Shader (或者说是ShaderLab 文件）里，我们可以做的事情远多于一个传统意义上的Shader。

- 在传统的Shader 中，我们仅可以编写特定类型的Shader, 例如顶点着色器、片元着色器
等。而在Unity Shader 中，我们可以在同一个文件里同时包含需要的顶点着色器和片元着
色器代码。
- 在传统的Shader 中，我们无法设置一些渲染设置，例如是否开启混合、深度测试等，这
些是开发者在另外的代码中自行设置的。而在Unity Shader 中，我们通过一行特定的指令
就可以完成这些设置。
- 在传统的Shader 中，我们需要编写冗长的代码来设置着色器的输入和输出，要小心地处
理这些输入输出的位翌对应关系等。而在Unity Shader 中，我们只需要在特定语句块中声明一些屈性，就可以依靠材质来方便地改变这些属性。而且对于模型自带的数据（如顶点位移、纹理坐标、法线等）， Unity Shader 也提供了直接访问的方法，不需要开发者自行编码来传给着色器。
当然， Unity Shader 除了上述这些优点外，也有一些缺点。由于Unity Shader 的高度封装性，我们可以编写的Shader 类型和语法都被限制了。对于一些类型的Shader, 例如曲面细分着色器（Tessellation Shader) 、几何着色器(Geometry Shader) 等， Unity 的支持就相对差一些。例如，Unity 4.x 仅在DirectX 11 平台下提供曲面细分着色器、几何着色器的相关功能，而对于OpenGL平台则没有这些支持。除此之外， 一些高级的Shader 语法Unity Shader 也不支持。

可以说， Unity Shader 提供了一种让开发者同时控制渲染流水线中多个阶段的一种方式，不仅仅是提供Shader 代码。作为开发者而言，我们绝大部分时候只需要和Unity Shader 打交道，而不需要关心渲染引擎底层的实现细节。

## Unity Shader 和CG/HLSL 之间的关系

Unity Shader 是用ShaderLab 语言编写的，但对于表面着色器和顶点／片元着色器，我们可以在ShaderLab 内部嵌套CG/HLSL 语言来编写这些着色器代码。这些CG/HLSL代码是嵌套在CGPROGRAM 和ENDCG 之间的，正如我们之前看到的示例代码一样。由于CG 和DX9 风格的HLSL 从写法上来说几乎是同一种语言，因此在Unity 里CG 和HLSL 是等价的。我们可以说， CG/HLSL 代码是区别于ShaderLab 的另一个世界。

通常， CG 的代码片段是位于Pass 语义块内部的，如下所示：

```c++
Pass {
		// Pass的标签和状态设置

		CGPROGRAM
		//编译指令，例如:
		#pragma vertex vert
		#pragma fragment frag

		// CG代码

		ENDCG
		//其他一些设置
}
```

读者可能会有疑问：”之前不是说在表面着色器中， CG/HLSL 代码是写在SubShader 语义块内吗？而不是Pass 块内。”的确，在表面着色器中， CG/HLSL 代码是写在SubShader 语义块内，但是读者应该还记得，表面着色器在本质上就是顶点／片元着色器，它们看起来很不像是因为表面着色器是Unjty 在顶点／片元着色器上层为开发者提供的一层抽象封装，但在背后， Unity 还是会把它转化成一个包含多Pass 的顶点／片元着色器。我们可以在Unity Shader 的导入设置面板中单击Show generated code 按钮来查看生成的真正的顶点／片元着色器代码。

可以说，从本质上来讲，** Unity Shader只有两种形式**：顶点／片元着色器和固定函数着色器（在Unity 5.2 以后的版本中，固定函数着色器也会在背后被转化成顶点／片元着色器，因此从本质上来说Unity 中只存在顶点／片元着色器）。