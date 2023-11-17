const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: { //author 작가? 서술가? 작품?
    type: String,
    required: true,
  },
  status: { //status 상황
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },


});

module.exports = mongoose.model("products", productsSchema); //디폴츠라는 컬렉션

// const productsSchema = new mongoose.Schema({
//   title: { type: String, required: true,},
//   content: {type: String, required: true,},
//   author: { type: String, required: true,},//author 작가? 서술가? 작품?
//   status: { type: String, required: true,},//status 상황
//   createdAt: { type: String, required: true,},
//   password: { type: String, required: true,},
// });