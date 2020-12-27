const express = require("express");
const router = express.Router();

// middleware
const auth = require("../middleware/auth");
// const validateObjectId = require("../middleware/validateObjectId");

// model & schema
const { Group, validate } = require("../models/group");
const { Category } = require("../models/category");

// GET all

// GET one

// POST
router.post("/", auth, async (req, res) => {
  console.log(req.body);

  // convert keywords string to array
  const keywords = req.body.keywords
    .split("#")
    .filter((element) => element !== "")
    .map((element) => element.trim());

  // error check
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // categoryId check
  const category = await Category.findById(req.body.categoryId);
  console.log("category:" + category);
  if (!category) return res.status(400).send("잘못된 카테고리 아이디입니다.");

  // object
  const group = new Group({
    title: req.body.title,
    category: {
      _id: category._id,
      name: category.name,
    },
    location: req.body.location,
    description: req.body.description,
    startTime: req.body.startTime,
    meetingDate: req.body.meetingDate,
    keywords: keywords,
    launcedDate: req.body.launchedDate,
  });

  // store data in MongoDB
  await group.save();

  // return
  res.send(group);
});

// DELETE

module.exports = router;
