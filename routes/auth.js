const express = require("express");
const router = express.Router();

const Joi = require("joi");
const bcrypt = require("bcrypt");

// model & schema
const { User } = require("../models/user");

// Post
router.post("/", async (req, res) => {
  // schema check
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // id check
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("부적합한 이메일 혹은 비밀번호입니다.");

  // password check (request vs stored)
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("부적합한 이메일 혹은 비밀번호입니다.");

  // return to clients with token
  const token = user.generateAuthToken();
  res.send(token);
});

// validate
function validate(req) {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .min(5)
      .max(255),
    password: Joi.string().required().min(5).max(1024),
  });
  return schema.validate(req);
}
module.exports = router;
