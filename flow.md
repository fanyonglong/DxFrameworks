# flow 
* [cli](#flow-cli)
* [config](#config)

## 使用flow
```js
// @flow
```


## flow-cli
```bash
Usage: flow [COMMAND] [PROJECT_ROOT]

Valid values for COMMAND:
  ast             Print the AST
  autocomplete    Queries autocompletion information
  check           Does a full Flow check and prints the results
  check-contents  Run typechecker on contents from stdin
  coverage        Shows coverage information for a given file
  find-module     Resolves a module reference to a file
  get-def         Gets the definition location of a variable or property
  get-importers   Gets a list of all importers for one or more given modules
  get-imports     Get names of all modules imported by one or more given modules
  init            Initializes a directory to be used as a flow root directory
  server          Runs a Flow server in the foreground
  start           Starts a Flow server
  status          (default) Shows current Flow errors by asking the Flow server
  stop            Stops a Flow server
  suggest         Shows type annotation suggestions for given files
  type-at-pos     Shows the type at a given file and position
  version         Print version information

Default values if unspecified:
  COMMAND         status
  PROJECT_ROOT    current folder

Status command options:
  --color              Display terminal output in color. never, always, auto (default: auto)
  --from               Specify client (for use by editor plugins)
  --help               This list of options
  --json               Output results in JSON format
  --no-auto-start      If the server is not running, do not start it; just exit
  --old-output-format  Use old output format (absolute file names, line and column numbers)
  --one-line           Escapes newlines so that each error prints on one line
  --retries            Set the number of retries. (default: 3)
  --retry-if-init      retry if the server is initializing (default: true)
  --show-all-errors    Print all errors (the default is to truncate after 50 errors)
  --strip-root         Print paths without the root
  --temp-dir           Directory in which to store temp files (default: /tmp/flow/)
  --timeout            Maximum time to wait, in seconds
  --version            (Deprecated, use `flow version` instead) Print version number and exit
```
## flow srict
启用flow 严格模式

## config
每个Flow项目都包含一个.flowconfig文件。您可以通过修改来配置Flow .flowconfig。开始使用Flow的新项目或项目可以.flowconfig通过运行生成默认值flow init
.flowconfig 格式 
在.flowconfig使用该国的形状像INI文件自定义格式。我们对自定义格式并不感到自豪，并计划在未来支持更好的格式。GitHub问题＃153跟踪这个。

在.flowconfig包括7个部分：

- [declarations]  声明文件
- [include]  包括
- [ignore] 忽略
- [libs]  程序文件
- [lints] 检查
- [options] 选项
- [version] 版本

### ignore
正则表达式。
Flow需要知道要读取哪些文件并注意更改。这组文件是通过获取所有包含的文件并排除所有被忽略的文件来确定的。
文件中的[ignore]部分.flowconfig告诉Flow在类型检查代码时忽略与指定正则表达式匹配的文件。默认情况下，不会忽略任何内容
```
示例[ignore]部分可能如下所示：

[ignore]
.*/__tests__/.*
.*/src/\(foo\|bar\)/.*
.*\.ignore\.js
本[ignore]节将忽略：

名为的目录下的任何文件或目录 __tests__
任何文件或目录在.*/src/foo或之下.*/src/bar
任何以扩展名结尾的文件 .ignore.js
```
### include
Flow需要知道要读取哪些文件并注意更改。这组文件是通过获取所有包含的文件并排除所有被忽略的文件来确定的。

文件中的[include]部分.flowconfig告诉Flow包含指定的文件或目录。递归地包括目录包括该目录下的所有文件。只要符号链接指向同时包含的文件或目录，就会遵循符号链接。include部分中的每一行都是要包含的路径。这些路径可以相对于根目录或绝对路径，并支持单星和双星通配符。

项目根目录（您的.flowconfig生活）将自动包含在内。
```
例如，如果/path/to/root/.flowconfig包含以下[include] 部分：

[include]
../externalFile.js
../externalDir/
../otherProject/*.js
../otherProject/**/coolStuff/
然后当Flow检查项目时/path/to/root，它将读取并观察

/path/to/root/ （自动包含）
/path/to/externalFile.js
/path/to/externalDir/
中的任何文件都/path/to/otherProject/以.js
/path/to/otherProject命名下的任何目录coolStuff/
```

### libs
文件中的[libs]部分.flowconfig告诉Flow 在类型检查代码时包含指定的库定义。可以指定多个库。默认情况下，flow-typed项目根目录中的 文件夹作为库目录包含在内。此默认允许您使用 flow-typed安装库定义而无需其他配置。

该[libs]部分中的每一行都是您要包含的库文件或目录的路径。这些路径可以相对于项目根目录或绝对路径。递归地包含目录包括该目录下的所有文件作为库文件。

### lints
文件中的[lints]部分.flowconfig可以包含以下形式的几个键值对：

[lints]
ruleA=severityA
ruleB=severityB
查看linting文档以获取更多信息。

### options 
https://flow.org/en/docs/config/options/

- all
- emoji
- esproposal.class_instance_fields
- esproposal.class_static_fields
- esproposal.decorators
- esproposal.export_star_as
- esproposal.optional_chaining
- esproposal.nullish_coalescing
- experimental.const_params
- include_warnings
- log.file
- max_header_tokens
- module.file_ext
- module.ignore_non_literal_requires
- module.name_mapper
- module.name_mapper.extension
- module.system
- module.system.node.resolve_dirname
- module.use_strict
- munge_underscores
- no_flowlib
- server.max_workers
- sharedmemory.dirs
- sharedmemory.minimum_available
- sharedmemory.dep_table_pow
- sharedmemory.hash_table_pow
- sharedmemory.heap_size
- sharedmemory.log_level
- strip_root
- suppress_comment
- suppress_type
- temp_dir
- traces

all (boolean) 
将其设置true为检查所有文件，而不仅仅是那些文件@flow。

allis 的默认值false。

emoji (boolean) 
将其设置true为将表情符号添加到Flow忙于检查项目时输出的状态消息。

emojiis 的默认值false。

esproposal.class_instance_fields (enable|ignore|warn) 
将此设置warn为表示Flow应 根据挂起的规范对实例类字段的使用发出警告。

您也可以将其设置ignore为指示Flow应该忽略语法（即Flow不会使用此语法来指示类的实例上是否存在属性）。

此选项的默认值为enable，允许使用此建议语法。

esproposal.class_static_fields (enable|ignore|warn) 
将此设置warn为表示Flow应 根据挂起的规范对静态类字段的使用发出警告 。

您也可以将其设置ignore为指示Flow应该忽略语法（即Flow不会使用此语法来指示类上是否存在静态属性）。

此选项的默认值为enable，允许使用此建议语法。

esproposal.decorators (ignore|warn) 
设置此项以ignore指示Flow应忽略装饰器。

此选项的默认值为，warn因为此提案仍处于早期阶段，因此会对使用发出警告。

esproposal.export_star_as (enable|ignore|warn) 
设置此项以enable指示Flow应支持leebyron提议的export * as 语法。

您也可以将其设置ignore为表示Flow应该忽略语法。此选项的默认值为，warn因为此提案仍处于早期阶段，因此会对使用发出警告。

esproposal.optional_chaining (enable|ignore|warn) 
将此设置enable为表示Flow应支持 根据挂起的规范使用 可选链接。

您也可以将其设置ignore为表示Flow应该忽略语法。

此选项的默认值为，warn因为此提案仍处于早期阶段，因此会对使用发出警告。

esproposal.nullish_coalescing (enable|ignore|warn) 
设置此项以enable指示Flow应支持 根据挂起的规范使用 nullish合并。

您也可以将其设置ignore为表示Flow应该忽略语法。

此选项的默认值为，warn因为此提案仍处于早期阶段，因此会对使用发出警告。

experimental.const_params (boolean) 
将此设置为true使Flow将所有函数参数视为const绑定。重新分配一个参数是一个错误，它允许Flow在细化方面不那么保守。

默认值为false。

include_warnings (boolean) 
将此设置为true使Flow命令在错误输出中包含警告。默认情况下，CLI会隐藏警告以避免控制台出现问题。（IDE是一个更好的界面来显示警告。）

默认值为false。

log.file (string) 
日志文件的路径（默认为/tmp/flow/<escaped root path>.log）。

max_header_tokens (integer) 
Flow试图避免解析非流文件。这意味着流程需要开始词法文件，看它是否具有@flow或@noflow在其中。此选项允许您在决定没有相关docblock之前配置文件流量的多少。

既不@flow是@noflow- 也不允许使用Flow语法解析此文件，也不要对其进行类型检查。
@flow - 解析此文件，允许使用Flow语法并进行类型检查。
@noflow - 允许使用Flow语法解析此文件，不要对其进行类型检查。这意味着可以在不必删除所有特定于Flow的语法的情况下抑制文件中的Flow。
默认值为max_header_tokens10。

module.file_ext (string) 
默认情况下，流量会寻找与扩展名的文件.js，.jsx，.mjs 和.json。您可以使用此选项覆盖此行为。

例如，如果你这样做：

[options]
module.file_ext=.foo
module.file_ext=.bar
然后Flow将寻找文件扩展名.foo和.bar。

注意：您可以指定module.file_ext多次

module.ignore_non_literal_requires (boolean) 
将此设置为true，当您使用require() 字符串文字以外的内容时，Flow将不再抱怨。

默认值为false。

module.name_mapper (regex -> string) 
指定正则表达式以匹配模块名称，并指定替换模式，用a分隔->。

例如：

module.name_mapper='^image![a-zA-Z0-9$_]+$' -> 'ImageStub'
这使Flow对待require('image!foo.jpg')就像它一样 require('ImageStub')。

这些是OCaml正则表达式。使用\(和\)（需要斜杠！）来创建一个捕获组，您可以在替换模式中将其引用为\1（最多\9）。

注意：您可以指定module.name_mapper多次

module.name_mapper.extension (string -> string) 
指定要匹配的文件扩展名和替换模块名称，用a分隔->。

注意：这只是简写 module.name_mapper='^\(.*\)\.EXTENSION$' -> 'TEMPLATE'）

例如：

module.name_mapper.extension='css' -> '<PROJECT_ROOT>/CSSFlowStub.js.flow'
使Flow require('foo.css')视为好像 require(PROJECT_ROOT + '/CSSFlowStub')。

注意：您可以module.name_mapper.extension为不同的扩展名指定多次。

module.system (node|haste) 
用于解决的模块系统import和require。 Haste用于React Native。

默认是node。

module.system.node.resolve_dirname (string) 
默认情况下，Flow将查找node_modules为节点模块命名的目录。您可以使用此选项配置此行为。

例如，如果你这样做：

[options]
module.system.node.resolve_dirname=node_modules
module.system.node.resolve_dirname=custom_node_modules
然后Flow将查找名为node_modules或的 目录custom_node_modules。

注意：您可以指定module.system.node.resolve_dirname多次

module.use_strict (boolean) 
true如果您使用添加"use strict";到每个模块顶部的转换器，请将此设置为。

默认值为false。

munge_underscores (boolean) 
将此设置为true将“将下划线 - 前缀”类属性和方法视为私有。这应该与jstransformES6类转换一起使用，它在运行时强制实施相同的隐私。

默认值为false。

no_flowlib (boolean) 
Flow已内置库定义。将此设置为true将告诉Flow忽略内置库定义。

默认值为false。

server.max_workers (integer) 
Flow服务器可以启动的最大工作数。默认情况下，服务器将使用所有可用的核心。

sharedmemory.dirs (string) 
这只会影响Linux。

Flow的共享内存存在于内存映射文件中。在更现代的Linux版本（3.17 +）上，有一个系统调用memfd_create允许Flow匿名创建文件，仅在内存中创建。但是，在较旧的内核中，Flow需要在文件系统上创建文件。理想情况下，此文件位于内存支持的tmpfs上。此选项允许您决定创建该文件的位置。

默认情况下，此选项设置为/dev/shm和/tmp

注意：您可以指定sharedmemory.dirs多次。

sharedmemory.minimum_available (unsigned integer) 
这只会影响Linux。

如sharedmemory.dirs选项说明中所述，Flow需要在较旧内核的文件系统上创建文件。sharedmemory.dirs指定可以创建共享内存文件的位置列表。对于每个位置，Flow将检查以确保文件系统具有足够的空间用于共享内存文件。如果Flow可能会用完空间，它会跳过该位置并尝试下一个位置。此选项允许您配置共享内存的文件系统所需的最小空间量。

默认情况下，它是536870912（2 ^ 29字节，这是半千兆字节）。

sharedmemory.dep_table_pow (unsigned integer) 
共享内存的3个最大部分是依赖表，哈希表和堆。当堆增长和缩小时，两个表被完全分配。此选项允许您更改依赖关系表的大小。

将此选项设置为X意味着该表将支持最多2 ^ X个元素，即16 * 2 ^ X个字节。

默认情况下，此值设置为17（表大小为2 ^ 17，即2兆字节）

sharedmemory.hash_table_pow (unsigned integer) 
共享内存的3个最大部分是依赖表，哈希表和堆。当堆增长和缩小时，两个表被完全分配。此选项允许您更改哈希表的大小。

将此选项设置为X意味着该表将支持最多2 ^ X个元素，即16 * 2 ^ X个字节。

默认情况下，此值设置为19（表大小为2 ^ 19，即8兆字节）

sharedmemory.heap_size (unsigned integer) 
此选项配置共享堆的最大可能大小。您很可能不需要配置它，因为它不会真正影响RSS Flow使用的数量。但是，如果您正在处理大量代码库，则在init之后可能会看到以下错误：“堆初始化大小太接近最大堆大小; GC永远不会被触发！“在这种情况下，您可能需要增加堆的大小。

默认情况下，此值设置为26843545600（25 * 2 ^ 30字节，即25GiB）

sharedmemory.log_level (unsigned integer) 
将此值设置为1将导致Flow输出一些有关从共享内存序列化和反序列化的数据的统计信息。

默认情况下，该值为0。

strip_root (boolean) ≤0.48  
已过时。将此设置为true使用时始终剥去在错误消息中的文件路径的根目录--json，--from emacs和--from vim。不要使用此选项。而是传递命令行标志--strip-root。

默认情况下这是false。

suppress_comment (regex) 
定义一个神奇的注释，可以抑制以下行中的任何Flow错误。例如：

suppress_comment= \\(.\\|\n\\)*\\$FlowFixMe
将匹配这样的评论：

// $FlowFixMe: suppressing this error until we can refactor
var x : string = 123;
并抑制错误。如果下一行没有错误（不需要抑制），则会显示“未使用抑制”警告。

如果您的配置中未指定抑制注释，Flow将应用一个默认值：// $FlowFixMe。

注意：您可以指定suppress_comment多次。如果您确实定义了任何suppress_comments，则内置$FlowFixMe抑制将被删除，以支持您指定的正则表达式。如果您希望使用$FlowFixMe其他一些自定义抑制注释，则必须\\(.\\|\n\\)*\\$FlowFixMe在自定义抑制列表中手动指定 。

suppress_type (string) 
此选项允许您any使用给定字符串进行别名。这对解释您使用的原因很有用any。例如，假设您有时希望有时使用any来抑制错误，有时也会标记TODO。您的代码可能看起来像

var myString: any = 1 + 1;
var myBoolean: any = 1 + 1;
如果将以下内容添加到配置中：

[options]
suppress_type=$FlowFixMe
suppress_type=$FlowTODO
您可以将代码更新为更易读：

var myString: $FlowFixMe = 1 + 1;
var myBoolean: $FlowTODO = 1 + 1;
注意：您可以指定suppress_type多次。

temp_dir (string) 
告诉Flow哪个目录用作临时目录。可以使用命令行标志重写--temp-dir。

默认值为/tmp/flow。

traces (integer) 
在所有错误输出上启用跟踪（显示有关通过系统的类型流的其他详细信息），达到指定的深度。这可能非常昂贵，因此默认情况下禁用