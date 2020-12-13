const express = require("express");
const winston = require("winston");
const app = express();

// logging | routing | connecting to DB
require("./startup/logging");
require("./startup/routes")(app, express);
require("./startup/db")(winston);
require("./startup/config")();
require("./startup/validation")();

console.log();

console.log(`현재 실행 환경: ${process.env.NODE_ENV}`);

// port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
