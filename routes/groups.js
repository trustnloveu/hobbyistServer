// express
const express = require("express");
const router = express.Router();

// middleware
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

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
  console.log(req.params.id);
  console.log(group);

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
    // launcedDate: req.body.launchedDate,
    members: [user._id],
    coverImage: req.body.coverImage,
  });

  // store data in MongoDB
  await group.save();

  // return
  res.send(group);
});

// PUT (join group)
router.put("/join", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send("확인되지 않는 유저입니다.");

  // check user duplication

  // check group & update
  const group = await Group.findByIdAndUpdate(
    req.body.groupId,
    {
      $push: {
        member: {
          userId: user._id,
          userName: user.name,
          isManager: true,
          isMember: true,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!group)
    return res
      .status(400)
      .send("존재하지 않는 그룹입니다. 다시 한 번 확인해주세요.");

  res.send(group);
});

// DELETE

module.exports = router;
