// routing
// endpoint = /api/users
const express = require("express");
const router = express.Router();

// authentication
const jwt = require("jsonwebtoken");
const config = require("config");

// hashing
const _ = require("lodash");
const bcrypt = require("bcrypt");

// middleware
const auth = require("../middleware/auth");

// modeling & defining schema
const { User, validate } = require("../models/user");

// GET
router.get("/myPage", auth, async (req, res) => {
  const user = await (await User.findById(req.user._id)).select("-password");
  res.send(user);
});

// POST
router.post("/", async (req, res) => {
  // error check
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // avoid duplication
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("등록된 유저입니다.");

  // sign-up
  user = new User(_.pick(req.body, ["email", "password", "name", "phone"]));

  // hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // save to DB
  await user.save();

  // return to clients with token in http header
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "email", "name", "phone"]));
});

module.exports = router;
