---
title: "处理CSV和JSON文件"
description: "处理CSV和JSON文件"
category: "Article"
date: "2024-03-10"
tags:
  - Article
  - 2026-03-11
---

# Reader对象

要用 csv 模块从 CSV 文件中读取数据，需要创建一个 Reader 对象。Reader 对象让你迭代遍历 CSV 文件中的每一行。

要用 csv 模块读取 CSV 文件，首先用 open() 函数打开它，就像打开任何其他文本文件一样。但是，不用在 open() 返回的 File 对象上调用 read() 或 readlines() 方法，而是将它传递给 csv.reader() 函数。这将返回一个 Reader 对象，供你使用。

```python
>>> import csv
>>> exampleFile = open('example.csv')
>>> exampleReader = csv.reader(exampleFile)
>>> exampleData = list(exampleReader)
>>> exampleData
[['4/5/2014 13:34', 'Apples', '73'],
 ['4/5/2014 3:41', 'Cherries', '85'],
 ['4/6/2014 12:46', 'Pears', '14'],
 ['4/8/2014 8:59', 'Oranges', '52'],
 ['4/10/2014 2:07', 'Apples', '152'],
 ['4/10/2014 18:10', 'Bananas', '23'],
 ['4/10/2014 2:40', 'Strawberries', '98']]
```

要访问 Reader 对象中的值，最直接的方法，就是将它转换成一个普通 Python 列表，即将它传递给 list()。在这个 Reader 对象上应用 list() 函数，将返回一个列表的列表。可以将它保存在变量 exampleData 中。

既然已经将 CSV 文件表示为列表的列表，就可以用表达式 `exampleData [row][col]` 来访问特定行和列的值。

`exampleData[0][0]` 进入第一个列表，并给出第一个字符串。`exampleData[0][2]` 进入第一个列表，并给出第三个字符串，以此类推。

```python
>>> exampleData[0][0]
'4/5/2015 13:34'
>>> exampleData[0][1]
'Apples'
>>> exampleData[0][2]
'73'
```

## 在 for 循环中，从 Reader 对象读取数据

对于大型的 CSV 文件，你需要在一个 for 循环中使用 Reader 对象。这样避免将整个文件一次性装入内存

```python
import csv
exampleFile = open('example.csv')
exampleReader = csv.reader(exampleFile)
for row in exampleReader:
        print('Row #' + str(exampleReader.line_num) + ' ' + str(row))
```

## Writer对象

Writer 对象让你将数据写入 CSV 文件。要创建一个 Writer 对象，就使用 csv.writer( )函数。

```python
>>> import csv
>>> outputFile = open('output.csv', 'w', newline='')
>>> outputWriter = csv.writer(outputFile)
>>> outputWriter.writerow(['spam', 'eggs', 'bacon', 'ham'])
21
>>> outputWriter.writerow(['Hello, world!', 'eggs', 'bacon', 'ham'])
32
>>> outputWriter.writerow([1, 2, 3.141592, 4])
16
>>> outputFile.close()
```

请注意，Writer 对象自动转义了 'Hello, world!' 中的逗号，在 CSV 文件中使用了双引号。模块 csv 让你不必自己处理这些特殊情况。

## delimiter 和 lineterminator 关键字参数

假定你希望用制表符代替逗号来分隔单元格，并希望有两倍行距。

```python
>>> import csv
>>> csvFile = open('example.tsv', 'w', newline='')
>>> csvWriter = csv.writer(csvFile, delimiter='\t', lineterminator='\n\n')
>>> csvWriter.writerow(['apples', 'oranges', 'grapes'])
24
>>> csvWriter.writerow(['eggs', 'bacon', 'ham'])
17
>>> csvWriter.writerow(['spam', 'spam', 'spam', 'spam', 'spam', 'spam'])
32
>>> csvFile.close()
```

传入 `delimeter='\t'` 和 `lineterminator='\n\n'` ，这将单元格之间的字符改变为制表符，将行之间的字符改变为两个换行符。然后我们调用 `writerow()` 三次，得到 3 行。

这产生了文件 example.tsv，包含以下内容：

```plain text
apples  oranges grapes

eggs    bacon    ham

spam    spam     spam     spam     spam     spam
```

既然单元格是由制表符分隔的，我们就使用文件扩展名 .tsv，表示制表符分隔的值。

# 项目：从 CSV 文件中删除表头

假设你有一个枯燥的任务，要删除几百个 CSV 文件的第一行。也许你会将它们送入一个自动化的过程，只需要数据，不需要每列顶部的表头。可以在 Excel 中打开每个文件，删除第一行，并重新保存该文件，但这需要几个小时。让我们写一个程序来做这件事。

该程序需要打开当前工作目录中所有扩展名为 .csv 的文件，读取 CSV 文件的内容，并除掉第一行的内容重新写入同名的文件。这将用新的、无表头的内容替换 CSV 文件的旧内容。

总地来说，该程序必须做到以下几点：

- 找出当前工作目录中的所有 CSV 文件。
- 读取每个文件的全部内容。
- 跳过第一行，将内容写入一个新的 CSV 文件。
在代码层面上，这意味着该程序需要做到以下几点：

- 循环遍历从 os.listdir() 得到的文件列表，跳过非 CSV 文件。
- 创建一个 CSV Reader 对象，读取该文件的内容，利用 line_num 属性确定要跳过哪一行。
- 创建一个 CSV Writer 对象，将读入的数据写入新文件。
针对这个项目，打开一个新的文件编辑器窗口，并保存为 removeCsvHeader.py。

# JSON 和 API

JavaScript 对象表示法是一种流行的方式，将数据格式化，成为人可读的字符串。

下面是 JSON 格式数据的一个例子：

```json
{
  "name": "Zophie",
  "isCat": true,
  "miceCaught": 0,
  "napsTaken": 37.5,
  "felineIQ": null
}
```

了解 JSON 是很有用，因为很多网站都提供 JSON 格式的内容，作为程序与网站交互的方式。这就是所谓的提供“应用程序编程接口（API）”。访问 API 和通过 URL 访问任何其他网页是一样的。不同的是，API 返回的数据是针对机器格式化的（例如用 JSON），API 不是人容易阅读的。

许多网站用 JSON 格式提供数据。都提供 API 让程序使用。有些网站需要注册，这几乎都是免费的。你必须找到文档，了解程序需要请求什么 URL 才能获得想要的数据，以及返回的 JSON 数据结构的一般格式。这些文档应在提供 API 的网站上提供，如果它们有“开发者”页面，就去那里找找。

利用 API，可以编程完成下列任务：

- 从网站抓取原始数据（访问 API 通常比下载网页并用 Beautiful Soup 解析 HTML 更方便）。
- 自动从一个社交网络账户下载新的帖子，并发布到另一个账户。例如，可以把 tumblr 的帖子上传到 Facebook。
- 从 IMDb、Rotten Tomatoes 和维基百科提取数据，放到计算机的一个文本文件中，为你个人的电影收藏创建一个“电影百科全书”。
## json 模块

Python 的 json 模块处理了 JSON 数据字符串和 Python 值之间转换的所有细节，得到了 json.loads() 和 json.dumps() 函数。JSON 不能存储每一种 Python 值，它只能包含以下数据类型的值：字符串、整型、浮点型、布尔型、列表、字典和 None。JSON 不能表示 Python 特有的对象，如 File 对象、CSV Reader 或 Writer 对象、Regex 对象或 Selenium WebElement 对象。

## 用 loads() 函数读取 JSON

要将包含 JSON 数据的字符串转换为 Python 的值，就将它传递给 json.loads() 函数（这个名字的意思是“load string”，而不是 “loads”）。

```python
>>> stringOfJsonData = '{"name": "Zophie", "isCat": true, "miceCaught": 0,
"felineIQ": null}'
>>> import json
>>> jsonDataAsPythonValue = json.loads(stringOfJsonData)
>>> jsonDataAsPythonValue
{'isCat': True, 'miceCaught': 0, 'name': 'Zophie', 'felineIQ': None}
```

导入 json 模块后，就可以调用 loads()，向它传入一个 JSON 数据字符串。请注意，JSON 字符串总是用双引号。它将该数据返回为一个 Python 字典。Python 字典是没有顺序的，所以如果打印 jsonDataAsPythonValue，键-值对可能以不同的顺序出现。

## 用 dumps 函数写出 JSON

json.dumps() 函数（它表示 “dump string”，而不是 “dumps”）将一个 Python 值转换成 JSON 格式的数据字符串。

# 项目：取得当前的天气数据

检查天气似乎相当简单：打开 Web 浏览器，点击地址栏，输入天气网站的 URL（或搜索一个，然后点击链接），等待页面加载，跳过所有的广告等。

其实，如果有一个程序，下载今后几天的天气预报，并以纯文本打印出来，就可以跳过很多无聊的步骤。该程序利用前面实验中学过的 requests 模块，从网站下载数据。

总的来说，该程序将执行以下操作：

- 从命令行读取请求的位置。
- 从 wthrcdn.etouch.cn 下载 JSON 天气数据。
- 将 JSON 数据字符串转换成 Python 的数据结构。
- 打印今天和未来四天的天气信息。
因此，代码需要完成以下任务：

- 连接 sys.argv 中的字符串，得到位置。
- 调用 requests.get()，下载天气数据。
- 调用 json.loads()，将 JSON 数据转换为 Python 数据结构。
- 打印天气预报。
针对这个项目，打开一个新的文件编辑器窗口，并保存为 quickWeather.py。