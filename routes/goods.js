const express = require("express");
const router = express.Router();

// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

router.get("/goods", (req, res) => {
	res.status(200).json({goods})
});

router.get("/goods/:goodsId", (req, res) => {
    const { goodsId } = req.params;
    const [detail] = goods.filter((good) => good.goodsId === Number(goodsId));
    res.json({ detail });
    // const [result] = goods.filter((good) => Number(goodsId) === good.goodsId)
    // res.status(200).json({ detail: result }); // 디테일이라는 이름으로 반환하면 api 완료다. 왜?
});

const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async(req,res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body; //구조분해할당

  const existsCarts = await Cart.find({goodsId});
  if (existsCarts.length){ //existsCart 이 변수의 길이가 있을때는, 에러 발생!
    return res.status(400).json
    ({
      success:false,
      errorMessage:"이미 장바구니에 해당하는 상품이 존재합니다.",
    })
  }

  await Cart.create({goodsId, quantity});

  res.json({result: "success"});
})

router.put("/goods/:goodsId/cart", async(req,res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.updateOne( // 하나만 수정하는 코드
      {goodsId: goodsId},
      {$set: {quantity:quantity}}
      );
  }
  res.status(200).json({success:true});
})

router.delete("/goods/:goodsId/cart", async(req, res) => {
  const {goodsId} = req.params;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId}); // _id가 뭔지 
  }

  res.json({result:"success"});
})

const Goods = require("../schemas/goods.js");
router.post("/goods/", async (req,res) => { // 어싱크, 동기적으로 처리 할 수 있게 해줌
  //어씽크로 하면 프로미스로 아래 값들이 받아지게 됨.
  const {goodsId, name, thumbnailUrl, category, price } = req.body; //객체 구조 문법 //데이터 있는지 요청 반환 되는지 확인. 동기적으로 되는지 확인.
  
  const goods = await Goods.find({goodsId});

  if( goods.length){ // 굳즈가 데이터 있으면 배열 안으로 올 거고, 없으면 배열 비게 될 것.
    return res.status(400).json({
      success:false,
      errorMessage:"이미 존재하는 굿즈아이디입니다."
    });
  }

    const createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});

    res.json({goods: createdGoods});
  })
  // 유니크 무조건 고유값들어와야해서 첫쨰 둘째 둘다 1로 들어오면 안됨.
  // 라우터에서도 그래서 검증 해야 한다.


  
module.exports = router;