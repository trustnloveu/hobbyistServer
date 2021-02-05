const mongoose = require("mongoose");

// express
const express = require("express");
const router = express.Router();

// middleware
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const findMember = require("../middleware/findMember");
const findJoinedGroup = require("../middleware/findJoinedGroup");

// image upload library
// const crypto = require("crypto"); // to generate file name
// const multer = require("multer");
// const uuidv4 = require("uuid/dist/v4");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, )
//   }
// })

// model & schema
const { Group, validate } = require("../models/group");
const { Category } = require("../models/category");
const { User } = require("../models/user");
const { find } = require("lodash");

// GET all
router.get("/", async (req, res) => {
  const groups = await Group.find().sort("launchedDate");
  res.send(groups);
});

// GET some (by categoryId)
router.get("/:id", validateObjectId, async (req, res) => {
  const groups = await Group.find({
    "category._id": req.params.id,
  }).sort("launchedDate");

  res.send(groups);
});

// GET one (by groupId)
router.get("/group/:id", validateObjectId, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.send(404).send("현재 존재하지 않는 그룹입니다.");

  res.send(group);
});

// POST
router.post("/", auth, async (req, res) => {
  // error check
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // convert keywords string to array
  const keywords = req.body.keywords
    .split("#")
    .filter((element) => element !== "")
    .map((element) => element.trim())
    .map((element) => element.replace(" ", ""));

  // userId check
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("잘못된 유저 아이디입니다.");

  // categoryId check
  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("잘못된 카테고리 아이디입니다.");

  // object
  const group = new Group({
    title: req.body.title,
    host: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    category: {
      _id: category._id,
      name: category.name,
    },
    location: req.body.location,
    address: req.body.address,
    description: req.body.description,
    startTime: req.body.startTime,
    meetingDate: req.body.meetingDate,
    keywords: keywords,
    members: [user._id],
    coverImage: req.body.coverImage,
  });

  // store data in MongoDB
  await group.save();

  // return
  res.send(group);
});

// PUT (join group)
router.put(
  "/joinNewGroup/:id",
  validateObjectId,
  auth,
  findMember,
  findJoinedGroup,
  async (req, res) => {
    // check group & update
    await req.group.updateOne({
      $push: {
        members: mongoose.Types.ObjectId(req.body.userId),
      },
    });

    // check user
    await req.user.updateOne({
      $push: {
        joinedGroups: mongoose.Types.ObjectId(req.params.id),
      },
    });

    // save
    req.group.save();
    req.user.save();

    // return
    res.send(req.group);
  }
);

// PUT (sign-out group)
router.put(
  "/signOutGroup/:id",
  validateObjectId,
  auth,
  findMember,
  findJoinedGroup,
  async (req, res) => {
    await req.group.updateOne({
      $pull: {
        members: mongoose.Types.ObjectId(req.body.userId),
      },
    });

    await req.user.updateOne({
      $pull: {
        joinedGroups: mongoose.Types.ObjectId(req.params.id),
      },
    });

    // save
    req.group.save();
    req.user.save();

    // return
    res.send(req.group);
  }
);

// DELETE

module.exports = router;
