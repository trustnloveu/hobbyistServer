const mongoose = require("mongoose");
const config = require("config");

module.exports = function (winston) {
  const db = config.get("db");
  console.log(db);

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
