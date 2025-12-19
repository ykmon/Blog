# 批量创建选中的ObjectMerge

```python
nodeList = list(hou.selectedNodes())
color = hou.Color(0.45, 0, 0.9)

# 获取当前激活的面板
pane = hou.ui.paneTabOfType(hou.paneTabType.NetworkEditor)

# 如果没有选定的节点或者未找到NetworkEditor面板，则退出
if not nodeList or not pane:
    print("No selected nodes or NetworkEditor pane not found")
    sys.exit()

# 获取当前选择位置
pos = pane.selectPosition()

for node in nodeList:
    nodeParent = node.parent()
    nodeParentPath = nodeParent.path()

    # 在父级节点下创建Object Merge节点
    objMerge = nodeParent.createNode('object_merge')

    # 设置Object Merge节点的输入路径和类型
    objMerge.parm('objpath1').set(node.path())
    objMerge.parm('xformtype').set(1)

    # 设置Object Merge节点的颜色和位置，并排列位置
    objMerge.setColor(color)
    objMerge.setPosition(pos)
    pos[0]+=3

    # 将Object Merge节点重命名为原始节点的名称前面加上'Merge_'
    objMerge.setName('Merge_' + node.name())
    

```