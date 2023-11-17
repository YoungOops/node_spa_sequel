const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true // 유니크 무조건 고유값들어와야해서 첫쨰 둘째 둘다 1로 들어오면 안됨.
  },
  name: {
    type: String,
    required: true,
    unique: true, 
    // 이름들 중복 되면 안된다잉
  },
  thumbnailUrl: {
    type: String, //url도 문자열이여서
  },
  category: {
    type: String, //카테고리 문자열로 할 거니까
  },
  price: {
    type: Number, // 가격 숫자니까
  }
});

module.exports = mongoose.model("Goods", goodsSchema); //디폴츠라는 컬렉션