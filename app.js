const express = require('express');
const app = express();
const port = 3000;

// const goodsRouter = require('./routes/goods');
// const cartsRouter = require('./routes/carts.js');
const productsRouter = require("./routes/products.router.js")
const connect = require("./schemas"); //여기서 index.js 빼고 폴더만 불러와도 가능이라 그냥 스키마스까지만
connect();


app.use(express.json()); // 포스트 메서드로 들어오는 바디 데이터를 사용하기 위해서는 이 문법 사용할 수 있다.
app.use("/api", [productsRouter]); //api 라는게 붙고 라우터로 전달 그래서 썬더 클라에서 주소입력을 api goods

app.get("/", (req,res) => {
    res.send("Hello World!");
});

// app.post("/", (req,res) => {
//     console.log(req.body);
//     res.send("기본 URI POST 메소드가 정상적으로 실행되었습니다.")
// })
// app.get("/", (req,res) => {
//     console.log(req.query);

//     res.status(400).json({
//         "KeyKey" : "value 입니다.",
//         "이름입니다." : "이름일까요?",
//     });
// });

app.get("/:id", (req,res) => {
    console.log(req.params);

    res.send(":id URI 에 정상적으로 반환되었습니다.")
})


app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });