const mongoose = require("mongoose");
const Joi = require("joi");

// category & user schema
const { categorySchema } = require("./category");
// const { imageSchema } = require("./image");

// schema
const groupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 20,
  },
  host: {
    type: Object,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
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
    default: new Date(),
  },
  members: {
    type: Array,
    default: [],
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
});

// model
const Group = mongoose.model("Group", groupSchema);

// validate inputs
function validateGroup(group) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(20).required(),
    userId: Joi.objectId().required(),
    categoryId: Joi.objectId().required(),
    location: Joi.string().required(),
    address: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(500).required(),
    startTime: Joi.string().required(),
    meetingDate: Joi.string().required(),
    keywords: Joi.string(),
    coverImage: Joi.binary().encoding("base64").required(),
  });
  return schema.validate(group);
}

exports.groupSchema = groupSchema;
exports.Group = Group;
exports.validate = validateGroup;
