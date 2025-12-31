# 技巧

### 制作模型时尽可能把单独的模块分开，把材质按照金属和非金属大致分类并给默认材质

![Untitled](Untitled.png)

### 使用同一个材质的模块时通过右键文件夹右方的“全部排除”功能，可以实现对应材质只在对应模型上使用的功能，数字1是选中的组件数量

![Untitled](Untitled%201.png)

### UV的接缝处时常会有问题，可以将映射模式更改为Tri-planar三面映射并调整硬度缓解

![Untitled](Untitled%202.png)

![Untitled](Untitled%203.png)

### 基本颜色层次的变化可以仅仅通过三个不同颜色叠加而成

![Untitled](Untitled%204.png)

注意调整粗糙度 金属度 颜色 透明度等

![Untitled](Untitled%205.png)

### 两个不同的效果作用于同一位置时，上面的效果可以才用线性叠加和调整透明度的方法

![Untitled](Untitled%206.png)

### 图层可以通过选择控制单一属性，也可以选择对应通道后调整透明度，将会只调整选中的部分

![Untitled](Untitled%207.png)

### 添加其他材质（如透明度）：着色器设置中更改

![Untitled](Untitled%208.png)

### 贴花融合技巧：降低明度、增加阴影、复制叠加、Grung paint streak贴图叠加

![Untitled](Untitled%209.png)

![Untitled](Untitled%2010.png)

![Untitled](Untitled%2011.png)

### 透明区域如何设置？

对透明区域单独复制一个材质，材质球修改混合模式为透明；开启双面显示；修改光照模式为表面半透明体积；透明通道存在BaseColor的A通道里

![Untitled](Untitled%2012.png)

![Untitled](Untitled%2013.png)

![Untitled](Untitled%2014.png)

### 导入的UE材质金属感过强？

ORM贴图关闭SRGB，改为线性颜色

![Untitled](Untitled%2015.png)

![Untitled](Untitled%2016.png)

### 颜色配置文件/色调映射/TAA

![Untitled](Untitled%2017.png)

![Untitled](Untitled%2018.png)

![Untitled](Untitled%2019.png)