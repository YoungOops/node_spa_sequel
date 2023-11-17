const jwt = require("jsonwebtoken");
const { Users } = require("../models");
console.log("커밋ㄱㄱ")

// 사용자 인증 미들웨어{
module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;// 권한 부여 -> 토큰 만드는 거라고 함 로그인 하면 콘솔에 나오는 쿠키즈에다 넣을거임
    const [authType, authToken] = (Authorization ?? 
        "").split(" "); // 이거 아마 베어러 그거 토큰 띄어쓰기 기준으로 배열로 잘라서 뒤에꺼만 썼던 거 같음

    if (!authToken || authType !== "Bearer") { // 암튼 토큰 받아온 거 안 되면 로그인 안되게해라
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능",
        });
        return;
    }

    try {
        const { email, name } = jwt.verify(authToken, "secret-key"); // 시크릿키 이거 음... 나중에 바꿔야할 듯
        const user = await Users.findOne({where : {email}}); //
        res.locals.user = user;
        next();
    }   catch (err) { // 딱봐도 그냥 에러 출력하는 듯
        console.error(err);
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};