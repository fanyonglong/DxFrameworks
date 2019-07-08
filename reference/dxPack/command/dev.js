const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const Config = require("webpack-chain");
const { isPlainObject } = require("lodash");

module.exports = function(api) {
  console.log("初始化dev");

  api.registerPlugin(require("../plugins/babel"));
  api.registerPlugin(require("../plugins/css"));
  api.registerCommand("dev", {}, function(ops) {
    console.log("执行dev");

    const chainConfig = new Config();
    chainConfig.mode("development");

    api.hooks.chainConfig.call(chainConfig);

    console.log(chainConfig.toConfig());
    return;
    var webpackConfig = chainConfig.toConfig();
    // 实例编译
    var compiler = webpack(webpackConfig);
    //运行编译
    compiler.run((err, stats) => {
      // ...
    });
    // 监听
    const watching = compiler.watch(
      {
        // watchOptions 示例
        aggregateTimeout: 300,
        poll: undefined
      },
      (err, stats) => {
        // 在这里打印 watch/build 结果...
        console.log(stats);
      }
    );
  });
};
