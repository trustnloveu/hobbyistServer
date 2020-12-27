const mongoose = require("mongoose");
const Joi = require("joi");

// category schema
const { categorySchema } = require("./category");

// schema
const groupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 20,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  },
  startTime: {
    type: String,
    required: true,
  },
  meetingDate: {
    type: String,
    required: true,
  },
  keywords: {
    type: Array,
    required: true,
  },
  launchedDate: {
    type: String,
    default: new Date("yyyy-MM-hh"),
  },
});

// model
const Group = mongoose.model("Group", groupSchema);

// validate inputs
function validateGroup(group) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(20).required(),
    categoryId: Joi.objectId().required(),
    location: Joi.string().required(),
    description: Joi.string().min(1).max(500).required(),
    startTime: Joi.string().required(),
    meetingDate: Joi.string().required(),
    keywords: Joi.string(),
    launchedDate: Joi.string().default(new Date("yyyy-MM-hh")),
  });
  return schema.validate(group);
}

exports.groupSchema = groupSchema;
exports.Group = Group;
exports.validate = validateGroup;
