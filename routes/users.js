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
const validateObjectId = require("../middleware/validateObjectId");
const { Group } = require("../models/group");

// GET
router.get("/myPage", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

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

  // create user object
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
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "email", "name", "phone"]));
});

// PUT > create a new group
router.put("/createNewGroup/:id", validateObjectId, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).send("현재 존재하지 않는 그룹입니다.");

  const user = await User.findByIdAndUpdate(
    req.body.userId,
    {
      $push: {
        hostingGroups: group._id,
        joinedGroups: group._id,
      },
    },
    {
      new: true,
    }
  );

  if (!user) return res.status(404).send("확인되지 않는 유저입니다.");

  res.send(user);
});

// PUT > join in a new group (member role)
router.put("/joinNewGroup/:id", validateObjectId, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).send("현재 존재하지 않는 그룹입니다.");

  res.send(group);
});

// PUT > join in a new group (member role)
router.put("/outJoinedGroup/:id", validateObjectId, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).send("현재 존재하지 않는 그룹입니다.");

  res.send(group);
});

// DELETE

module.exports = router;
