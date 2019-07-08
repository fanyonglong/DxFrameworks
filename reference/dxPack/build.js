const yParser = require("yargs-parser");

process.env.NODE_ENV = "production";

const args = yParser(process.argv.slice(2));
const Service = require("./Service");
new Service({}).run("build", args);
