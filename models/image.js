const mongoose = require("mongoose");
const Joi = require("joi");

// schema
const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    deafult: "none",
    required: true,
  },
  imageData: {
    type: String,
    required: true,
  },
});

// model
const Image = mongoose.model("Image", imageSchema);

// validate
// function validateImage(image) {
//   const schema = Joi.object({
//     image: Joi.string().required(),
//   });
//   return schema.valid(group);
// }

exports.imageSchema = imageSchema;
exports.Image = Image;
// exports.validate = validateImage;
