//从下到上
let presets = [
    [
      "@babel/preset-env",
      {
        /**
         *Example environments: chrome, opera, edge, firefox, safari, ie, ios, android, node, electron
         * targets.node
          string | "current" | true。
          如果要针对当前节点版本进行编译，则可以指定"node": true或者"node": "current"与之相同"node": process.versions.node。
          targets.safari
          string | "tp"。
          如果要针对Safari 的技术预览版进行编译，则可以指定"safari": "tp"。
          targets.browsers
          string | Array<string>。
          使用：查询中选择浏览器（最后2个版本，> 5％，Safari浏览器TP前）browserslist。
          请注意，浏览器的结果会被显式项覆盖targets。
          注意：这将在以后的版本中删除，有利于直接将“目标”设置为查询。
         */
        targets: {
          browsers:'last 3 versions'
         // esmodules:false,//请注意：在指定esmodules目标时，将忽略浏览器目标。
          // edge: "17",
          // firefox: "60",
          // chrome: "67",
          // safari: "11.1",
          // ie:8
        },
        /** 
         * Array<string|RegExp>，默认为[]。
          一系列总是包含的插件。
          有效选项包括：
          Babel插件 - 支持带（@babel/plugin-transform-spread）和不带前缀（plugin-transform-spread）。
          内置插件，例如es6.map，es6.set或es6.object.assign。
          可以完全或部分指定（或使用RegExp）插件名称。
          可接受的投入：
          全名（string）："es6.math.sign"
          部分名称（string）:( "es6.math.*"解析为所有带es6.math前缀的插件）
          RegExp对象：/^transform-.*$/或new RegExp("^transform-modules-.*")
        */
        include:[],
        /**
         * Array<string|RegExp>，默认为[]。
      一系列总是要排除/删除的插件。
      可能的选项与include选项相同。
      此选项对于将变换“列入黑名单”非常有用，
      例如，@babel/plugin-transform-regenerator如果您不使用生成器并且不想包含regeneratorRuntime（使用时useBuiltIns）或使用其他插件（如fast-async而不是Babel的async-to-gen）。
              *  */
        exclude:[],
        spec:false,//为此预设中支持它们的任何插件启用更符合规范但可能更慢的转换。
        modules:false,//'commonjs',//"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | false，默认为"commonjs"。
        debug:false,//boolean，默认为false。输出使用的目标/插件，并在指定的版本插件数据版本来console.log。
        /*
        entry:此选项启用一个新插件，用​​于替换语句import "@babel/polyfill"或基于环境的require("@babel/polyfill")个别需求@babel/polyfill
        usage:在每个文件中使用polyfill时，为polyfill添加特定导入。我们利用捆绑器仅加载相同的polyfill一次的事实。
        false:不要为每个文件自动添加polyfill，也不要转换import "@babel/polyfill"为单个polyfill。
         */
        useBuiltIns: false,//"usage",//"usage"| "entry"| false，默认为false。
        //默认情况下，此预设将运行目标环境所需的所有变换。如果要强制运行所有 转换，请启用此选项，如果输出将通过UglifyJS或仅支持ES5的环境运行，则此选项很有用。
        forceAllTransforms:false,//boolean，默认为false。 
        /** string，默认为 process.cwd()
        配置搜索browserslist的起点将开始，然后上升到系统根目录，直到找到。
        */
        configPath:process.cwd(),
        /** 
         * boolean，默认为 false
        切换启用对浏览器中提供的内置/功能提议的支持。
        如果目标环境对功能提议具有本机支持，则会启用其匹配的解析器语法插件，
        而不是执行任何转换。请注意，这不会启用相同的转换@babel/preset-stage-3，因为提案可以在登陆浏览器之前继续更改。
        */
        shippedProposals:false  
       }
    ]
  ];

/***
 * loose
 * 1. 两种模式
许多Babel的插件有两种模式：
• 尽可能符合ECMASCRIPT6语义的NORMAL模式。
• 提供更简单ES5代码的LOOSE模式。
 *  */

  // 从上到下
  let plugins=[
  // ['@babel/plugin-external-helpers'],
   ['@babel/plugin-proposal-class-properties',{ "loose": true }]
    // ["@babel/plugin-transform-classes", {
    //   "loose": false
    // }],
    /*** 
     * 该transform-runtime变压器插件做了三两件事：
    @babel/runtime/regenerator使用生成器/异步功能时自动需要（可通过regenerator选项切换）。
    可以core-js在必要时用于帮助者，而不是假设用户将其填充（可通过corejs选项进行切换）
    自动删除内联Babel帮助程序并@babel/runtime/helpers改为使用该模块（可以使用该helpers选项进行切换）。
    这究竟意味着什么？基本上，你可以使用内置的插件，如Promise，Set，Symbol，等，以及使用所有需要填充工具无缝连接，无需全球污染通天特点，使其非常适合于图书馆。
    
    确保包含@babel/runtime为依赖项。
    */
    // ['@babel/plugin-transform-runtime',{
    //   corejs:false,//corejs boolean或者number，默认为false。 例如 ['@babel/plugin-transform-runtime', { corejs: 2 }],
    //   helpers:true,//切换是否内联通天佣工（classCallCheck，extends，等）被替换为调用moduleName。
    // }]
    ];
      
  
  module.exports = { 
      presets,
      plugins,
      include:['./src'],
      //exclude: 'node_modules/**' // 只编译我们的源代码
      exclude: 'node_modules/**' // 只编译我们的源代码
 };