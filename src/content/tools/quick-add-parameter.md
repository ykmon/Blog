---
title: "快速添加自定义Parameter"
description: "通过Python脚本快速为Houdini节点添加自定义参数"
category: "Houdini / Tool"
date: "2023-11-25"
icon: "⚡"
tags:
  - Houdini
  - Code
---

通过对话框快速为选中的 Houdini 节点添加 float、int 或 string 类型的自定义参数。

```python
nodeList = list(hou.selectedNodes())

parm_templates = {
    "float": hou.FloatParmTemplate,
    "int": hou.IntParmTemplate,
    "string": hou.StringParmTemplate
}

def input_Name():
    # 使用 Houdini 的 UI 接口读取输入
    inputName = hou.ui.readMultiInput("创建属性信息", ["属性类型", "属性名称", "属性标签Label"], buttons=["OK", "Cancel"])[1]
    return inputName

def add_Parameter(node):
    # 将输入的属性信息拆分
    parm_type, parm_name, parm_label = input_Name()

    # 根据属性类型创建相应的参数模板
    parm_template = parm_templates[parm_type](parm_name, parm_label, 1)
    
    # 获取节点的参数模板组
    parm_template_group = node.parmTemplateGroup()

    # 根据参数类型插入参数模板
    if b == 'group':
        parm_template_group.insertBefore('group', parm_template)
    else:
        parm_template_group.insertBefore(c, parm_template)

    # 更新节点的参数模板组
    node.setParmTemplateGroup(parm_template_group)

# 遍历选中的每个节点
for selNode in nodeList:
    # 获取节点的所有参数
    parameters = selNode.parms()
    
    # 获取节点的第一个和第二个参数名
    b = parameters[0].name()
    c = parameters[1].name()

    # 调用函数添加参数
    add_Parameter(selNode)
```
