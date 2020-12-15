const cors = require("cors");

// router
const users = require("../routes/users");
const auth = require("../routes/auth");
const categories = require("../routes/categories");

// middleware
// const error = require("../middleware/error");

//routing
module.exports = function (app, express) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/users", users);
  app.use("/api/categories", categories);
  app.use("/api/auth", auth);
  //   app.use(error);
};
