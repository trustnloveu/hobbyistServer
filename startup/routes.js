const cors = require("cors");

// router
const auth = require("../routes/auth");
const categories = require("../routes/categories");
const groups = require("../routes/groups");
const users = require("../routes/users");

// middleware
// const error = require("../middleware/error");

//routing
module.exports = function (app, express) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/auth", auth);
  app.use("/api/categories", categories);
  app.use("/api/groups", groups);
  app.use("/api/users", users);
  //   app.use(error);
};
