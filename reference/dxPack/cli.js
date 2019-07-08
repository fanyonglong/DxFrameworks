const { dirname } = require("path");
const yParser = require("yargs-parser");
const signale = require("signale");
const semver = require("semver");
const yargs = require("yargs");
// Node version check
const nodeVersion = process.versions.node;
if (semver.satisfies(nodeVersion, "<6.5")) {
  signale.error(`Node version must >= 6.5, but got ${nodeVersion}`);
  process.exit(1);
}
// 检查package.json 包是否需要更新
const updater = require("update-notifier");
const pkg = require("../package.json");
updater({ pkg }).notify({ defer: true });

yargs
  .usage("run dev")
  .command(
    "run <mode>",
    "运行编辑程序",
    yargs => {
      yargs.positional("mode", {
        describe: "请选择编译模式",
        alias: "m",
        type: "string",
        choices: ["dev", "build"]
      });
    },
    argv => {
      switch (argv.mode) {
        case "dev":
        case "build":
          require("./" + argv.mode);
          break;
      }
    }
  )
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, "请运行编译命令");

const CONFIG_GROUP = "config";
var argv = yargs
  .help("help")
  .alias("help", "h")
  .version()
  .alias("version", "v")
  .options({
    config: {
      type: "string",
      describe: "Path to the config file",
      group: CONFIG_GROUP,
      defaultDescription: "配置文件",
      requiresArg: true
    }
  })
  .help().argv;
//console.log(argv)
