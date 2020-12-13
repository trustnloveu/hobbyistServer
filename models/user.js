const mongoose = require("mongoose");
const Joi = require("joi");

const jwt = require("jsonwebtoken");
const config = require("config");

// modeling & schema
mongoose.set("useCreateIndex", true);

// Schema
const userSchema = new mongoose.Schema({
  email: {},
  password: {},
  name: {},
  phone: {},
  rolls: [],
  isAdmin: Boolean,
});

// Assign JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

// Object
const User = mongoose.model("User", userSchema);

// validate user with schema
function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(10),
    phone: Joi.string().required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
