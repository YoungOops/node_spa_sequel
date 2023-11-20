//미들웨어에서 인증을 jwt 로 하는 것 같다.
const jwt = require("jsonwebtoken"); 
const { Users } = require("../models");
console.log("커밋ㄱㄱ")

// 사용자 인증 미들웨어{
module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;// 권한 부여 -> 토큰 만드는 거라고 함 로그인 하면 콘솔에 나오는 쿠키즈에다 넣을거임
    const [authType, authToken] = (Authorization ?? "").split(" "); 
    // 이거 아마 베어러 그거 토큰 띄어쓰기 기준으로 배열로 잘라서 뒤에꺼만 썼던 거 같음

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

// ### 인증 Middleware

// 1. Request Header의 Authorization 정보에서 JWT를 가져와서, 인증 된 사용자인지 확인하는 Middleware를 구현합니다.
// 2. 인증에 실패하는 경우에는 알맞은 Http Status Code와 에러 메세지를 반환 해야 합니다.
//     - Authorization에 담겨 있는 값의 형태가 표준(Authorization: Bearer <JWT Value>)과 일치하지 않는 경우
//     - JWT의 유효기한이 지난 경우
//     - JWT 검증(JWT Secret 불일치, 데이터 조작으로 인한 Signature 불일치 등)에 실패한 경우
// 3. 인증에 성공하는 경우에는 req.locals.user에 인증 된 사용자 정보를 담고, 다음 동작을 진행합니다.