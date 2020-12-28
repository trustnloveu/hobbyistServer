const mongoose = require("mongoose");
const Joi = require("joi");

const jwt = require("jsonwebtoken");
const config = require("config");

// modeling & schema
mongoose.set("useCreateIndex", true);

// Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 20,
  },
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
      .required()
      .min(5)
      .max(255),
    password: Joi.string().required().min(5).max(1024),
    name: Joi.string().required().min(2).max(50),
    phone: Joi.string().required().min(9).max(20),
  });
  return schema.validate(user);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
