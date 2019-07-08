const debug = require("debug")("dx:send");

const DONE = "DONE";
const STARTING = "STARTING";
const RESTART = "RESTART";

function send(message) {
  if (process.send) {
    debug(`send ${JSON.stringify(message)}`);
    process.send(message);
  }
}
module.exports = {
  send,
  DONE,
  STARTING,
  RESTART
};
