const mongoose = require("mongoose");
const Joi = require("joi");

// schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10,
  },
});

// model
const Category = mongoose.model("Category", categorySchema);

// validate object
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(10).required(),
  });
  return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
