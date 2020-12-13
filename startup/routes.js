// router
const users = require("../routes/users");

// middleware
// const error = require("../middleware/error");

//routing
module.exports = function (app, express) {
  app.use(express.json());
  app.use("/api/users", users);
  //   app.use(error);
};
