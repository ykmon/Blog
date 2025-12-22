# Unity Shader 结构体类型

**a2v、v2f、f2a、appdata_base、appdata_tan、appdata_full**

初学shader，看到别人的代码，肯定会看到a2f、v2f等结构体，这里来详细解释一下

首先 a2v v2f是结构体struct，并且是顶点函数（vertex）和片元函数（frag）的相互转换。

- **a2v（从应用程序传递到顶点函数）a--应用程序，2--to，v--顶点函数（vert）**

```glsl
struct a2v // 命名表示从应用程序传递到顶点函数，application to vertex
 {
    float4 vertex : POSITION;    // 告诉Unity把模型空间下的顶点坐标填充给vertex属性
    float3 normal : NORMAL;      // 告诉Unity把模型空间下的法线方向填充给normal属性
    float4 texcoord : TEXCOORD0; // 告诉Unity把第一套纹理坐标填充给texcoord属性
    float4 tangent : TANGENT;    // 告诉Unity把模型空间下的切线向量填充给tangent属性
    float4 texcoord0 : TEXCOORD0;// 告诉Unity第一套贴图uv坐标填充给texcoord0属性（共4套）
    float4 color : COLOR;        // 告诉Unity顶点色填充给color属性
 };
```

- **v2f（从顶点函数传递到片元函数）v--顶点函数（vert），2--to，f--片元函数（frag）**

```glsl
struct v2f //命名表示从顶点函数传递到片元函数，vertex to fragment
{
    float4 position:SV_POSITION; //转换为裁剪空间的顶点坐标
    float4 color:COLOR;
}
```

- **f2a（片元函数应用到系统着色）f--片元函数，2--to，a--application**

```glsl
fixed4 frag(v2f IN) : SV_Target //应用到系统着色，SV_TARGET 颜色值，显示到屏幕上的颜色
{
    return fixed4(1,1,1,1);
}
```

- appdata_base

```glsl
struct appdata_base {
    float4 vertex : POSITION;　　//顶点位置
    float3 normal : NORMAL;　　//法线
    float4 texcoord : TEXCOORD0;//纹理坐标
    UNITY_VERTEX_INPUT_INSTANCE_ID
};
```

- **appdata_tan**

```glsl
struct appdata_tan {
    float4 vertex : POSITION;　　//顶点坐标位置
    float4 tangent : TANGENT;　　//切线
    float3 normal : NORMAL;　　//法线
    float4 texcoord : TEXCOORD0;　　//第一纹理坐标
    UNITY_VERTEX_INPUT_INSTANCE_ID
};
```

- **appdata_full**

```glsl
struct appdata_full {
    float4 vertex : POSITION;
    float4 tangent : TANGENT;
    float3 normal : NORMAL;
    float4 texcoord : TEXCOORD0;　　//第一纹理坐标
    float4 texcoord1 : TEXCOORD1;　　//第二纹理坐标
    float4 texcoord2 : TEXCOORD2;　　//第三纹理坐标
    float4 texcoord3 : TEXCOORD3;　　//第四纹理坐标
    fixed4 color : COLOR;//顶点颜色
    UNITY_VERTEX_INPUT_INSTANCE_ID
};
```