const express = require("express");
const router = express.Router();

// middleware > auth, admin, validateObjectId
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// model & schema
const { Category, validate } = require("../models/category");

// GET ALL
router.get("/", async (req, res) => {
  const categories = await Category.find().sort("name");

  res.send(categories);
});

// GET ONE
router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return res.status(404).send("해당 카테고리는 존재하지 않습니다.");

  res.send(category);
});

// POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create object based on modeling from mongoose
  let category = new Category({ name: req.body.name });
  category = await category.save();

  res.send(category);
});

// PUT
router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!category)
    return res.status(404).send("해당 카테고리는 존재하지 않습니다.");

  res.send(category);
});

// DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res.status(404).send("해당 카테고리는 존재하지 않습니다.");

  res.send(category);
});

module.exports = router;
