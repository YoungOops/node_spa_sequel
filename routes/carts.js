const express = require("express");
const router = express.Router();

//스키마 컬렉션(Collection)에 들어가는 문서(Document)에 어떤 종류의 값이 들어가는지를 정의
const Cart = require("../schemas/cart.js"); 
const Goods = require("../schemas/goods.js");

// localhost:3000/api/carts GET Method
router.get("/carts", async(req,res) => { //어싱크 동기적 처리
    const carts = await Cart.find({}); //1. 장바구니의 모든 데이터 값 찾고
    // [
    //  {goodsId, quantity}
    //  {goodsId, quantity}
    // ];
    const goodsIds = carts.map((cart) => {//맵으로 하나씩 배열을 순회 돌게 함.
        return cart.goodsId; //2. 카트 안에있는 배열의 모든 데이터 아이디 값 하나씩 찾고
    })
    // [2, 11, 19];

    const goods = await Goods.find({goodsId: goodsIds});
    //({goodsId: goodsIds}를 통해서 Goods에 해당하는 모든 상세 정보를 가지고 올 것이다.
    //만약 goodsIds 변수 안에 존재하는 값일 때에만 조회하라.

    const results = carts.map((cart) => {
        return {
            "quantity": cart.quantity,
            "goods": goods.find((item) => item.goodsId === cart.goodsId),
        } //이 키는 "" 안에 감싸도 됨.
    })

    res.json({
        "carts": results,
    })
})



module.exports = router;