const express = require("express");
const cart = require("../schemas/cart.js");
const { listIndexes } = require("../schemas/products.schema.js");
const router = express.Router();
const Products = require("../schemas/products.schema.js");

// 상품 등록.
router.post("/products", async (req, res) => {
    try {
        const { title, content, author, password } = req.body; //구조분해할당
        console.log(req.body);
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        let day = currentDate.getDate();
        let hours = currentDate.getHours(); // 시간
        let minutes = currentDate.getMinutes(); // 분
        let seconds = currentDate.getSeconds(); // 초
        let date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        await Products.create({
            title: title,
            content: content,
            author: author,
            password: password,
            createdAt: date,
            status: "for sale"
        });

        res.json({
            "message": "판매 상품을 등록하였습니다."
        });
    }
    catch {
        res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' })
    }
})

//상품 조회
router.get("/products", async (req, res) => {
    const products = await Products.find({});

    res.status(200).json({ products })
});


// 상세 조회
router.get("/products/:productId", async (req, res) => {
    try {
        console.log(req.params); //req.params: 라우터 매개 변수에 대한 정보가 담긴 객체입니다.

        const { productId } = req.params;
        const products = await Products.find({});

        const product = products.filter((p) => productId === p._id.toString()); // p는 필터 돌려고 만든거 같음
        if (product.length === 0) {
            return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
        } //제이슨 형태로 리턴 값 줄 것이다.
        return res.status(200).json({ data: product[0] })
    }
    catch {
        return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' })
    }
});

//---------------------------------- 여기까지 다 떠먹여주셨습니다... 다형님께서
//아래는 가이드 받고 제가 해보았습니다. (결국 86번째 줄 도움 받았습니다.)


// await Products.updateOne({ _id:id },{title,content,author}) 일괄 수정용으로 받은 코드
//아이디랑 바디 받기 updateOne( // 하나만 수정하는 코드

// 상품 수정
router.put("/products/:productId", async (req, res) => {
    try {
        console.log(req.params);

        const { productId } = req.params;
        const { title, content, password, status } = req.body;
        // const products = await Products.find({password}); ?

        const existsProducts = await Products.find({ _id: productId });
        console.log(existsProducts)

        if (existsProducts.length) {//existsProducts 값이 존재할 때만 실행?
            const product = existsProducts[0] //한 개를 뜻하는 듯 하다
            if (product.password === password) {
                await Products.updateOne( // 업데이트 할 것이다. 프로덕츠를
                    // 만약에 _아이디에 해당하는 값이 있을 때
                    //우리는 수정을 할거다 타이틀을 타이틀에 있는 값으로 왼쪽이 찾는 것, 오른쪽이 값을 수정한다.
                    // 오른쪽은 위에 콘스트 const { title, content, password, status } = req.body; 이 값들인 듯
                    { _id: productId },
                    {$set:
                        {
                            title: title,
                            content: content,
                            password: password,
                            status: status
                        }
                    }
                );return res.status(200).json({message: "상품 정보 수정했습니다." });
            }
        } return res.status(401).json({ message: "상품을 수정할 권한이 없습니다." });
        //  else {
        //     res.status(404).json({ success: false, message: "상품 조회에 실패하였습니다." });
        // }
    }
    catch {
        return res.status(404).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' })
    }
});

// 상품 삭제
router.delete("/products/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { password } = req.body;

    // await Cart.deleteOne({_id:productId});
    const existsProducts = await Products.find({ _id: productId });
    if (existsProducts.length) {
        const product = existsProducts[0]
        if (product.password === password){
            await Product.deletOne(
                { _id: productId },
                {$set: {password: password}}
                
            );
        }return res.json({ message: "상품을 삭제하였습니다." });

    }return res.status(401).json({message: "상품을 수정할 권한이 없습니다." });

} catch {
    return res.status(404).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' })
}

});

module.exports = router;

// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 productId에 해당하는 상품이 존재하지 않을 경우
// { message: 상품 조회에 실패하였습니다. }
// # 401 상품의 비밀번호가 일치하지 않을 경우
// { message: 상품을 삭제할 권한이 존재하지 않습니다. }