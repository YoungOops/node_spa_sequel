const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true // 유니크 무조건 고유값들어와야해서 첫쨰 둘째 둘다 1로 들어오면 안됨.
  },
  quantity: { //수량
    type: Number,
    required: true,

  }
});

module.exports = mongoose.model("Cart", cartSchema); //디폴츠라는 컬렉션