const jwt = require("jsonwebtoken"); // 'jsonwebtoken' 라이브러리를 불러옴 JSON Web Token 생성 검증 때 사용
const express = require("express"); // express 라이브러리 불러옴 웹서버 구축할 때 씀
const router = express.Router(); // express의 Router 객체를 생성
const { Users } = require("../models"); // Router 함수를 호출하여 router라는 객체
// 모델스 디렉토리에서 Users 모델 불러오는거임
const encrypt = require("../encrypt/encrypt.js"); // 인크립트 함수 불러오는거임 모듈화 해논 듯 비밀번호 암호화 할 때 사용
//인크립트가 암튼 암호화하는거임
const authMiddleware = require("../middlewares/auth-middleware"); //이 미들웨어는 요청 처리 전 인증 수행 때 사용

// 다시 해보자 1-13강 메모해놓은거 참고 or 노션 자료 참고

//회원가입 -> 같은 조 윤서님 도움으로 계속 수정 중
router.post("/users", async (req, res) => { // /users 경로로 들어오는 POST요청을 처리하는 라우터
    // console.log(req.body);
    try {
        const { email, name, password, confirmPassword } = req.body;
        // 클라이언트한테 req.body 받는 것들에서.. 이메일이랑 이름 패스워드 패스워드확인 정보 추출
        if (!email || !name || !password || !confirmPassword) {
            //만약에 비교해서 다른게 요청 오면 아래 조건 출력하게 함 ??? -> 그럴 일이 어떻게 일어나게 하는지 알아보기
            return res.status(401).json({ // 401 : 권한 없음
                "success": false,
                "message": "데이터형식이 올바르지 않습니다."
            });
        }

        const emailExp = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
        //메일 형식을 검사하기 위한 정규표현식을 생성한거임 복붙 했음
        const emailCheck = emailExp.test(email);//이메일체크라는 변수 줘서 사용자가 입력한 이메일이 정규표현식에 맞는 형식인지 테스트
        if (!emailCheck) { // 이메일체크 해봤는데
            return res.status(402).send({ // 402 : 결제 필요
                "success": false,
                "message": "이메일 형식이 올바르지 않음"
            }); //이메일 형식이 잘못되었다면 상태코드, 에러 메시지를 보냄
        }

        if (password.length < 6) { // 비밀번호 갯수 5자리 미만이면 패스워드 너무 짧다고 뜰거임
            return res.status(403).send({
                "success": false,
                "message": "패스워드가 너무 짧음"
            });
        }

        if (password !== confirmPassword) { // 아 패스워드랑 패스워드 확인란
            return res.status(404).json({ //404 코드 : 찾을 수 없음
                "success": false,
                "message": "패스워드가 패스워드 확인란과 다름"
            });
        }

        const existsUserName = await Users.findOne({ where: { name } }); //UsernName 지우고 바꿈
        const existsUserEmail = await Users.findOne({ where: { email } });
        if (existsUserName || existsUserEmail) {
            return res.status(405).json({ // 405 코드 : 허용되지 않은 메소드 ? 요청한 URI가 지정한 메소드를 지원하지 않음
                "success": false,
                "message": "이메일 또는 닉네임 이미 사용중.",
            });
        }

        //암호화
        const encryptPw = encrypt(password);
        const user = new Users({ email, name, password: encryptPw });
        // 키 벨류 같으면 딸랑 하나, 패스워드가 암호화 되어서 

        await user.save();

        return res.status(200).json({ // 200 : OK! 성공~
            "success": true,
            "message": "회원가입에 성공했다."
        });
    } catch (err) {
        console.log(err, '에러')
        return res.status(400).json({ // 400 : 잘못된 요청
            "success": false,
            "message": "회원 가입 대실패"
        });
    }
});


//로긴 모르겠어서 일단 다형님 블로그에서 가져오기

router.post("/users/login", async (req, res) => {

    const { email, password } = req.body
    const encryptPw = encrypt(password);
    try {

        const result = await Users.findOne({ where: { email, password: encryptPw } }) // 웨어절이 뭐지
        if (!result) {
            return res.status(401).json({
                "success": false,
                "message": "이메일이나 비밀번호가 잘못 되었습니다."
            });
        } //console.log("값이 없다") 
        // console.log(result);

        if (result.password === encryptPw) {
            //여기서 토큰 발급해서 인증하는 것 같다.
            let expires = new Date();
            expires.setMinutes(expires.getMinutes() + 60 * 12); //만료시간 12시간으로 설정하는 거라고 함

            const token = jwt.sign(
                { email, name: result.name },
                "secret-key",
            );
            res.cookie("Authorization", `Bearer${token}`, { expires: expires })
            //JWT를 쿠키로 할당하는거라고 함
            return res.status(200).json({
                "success": true,
                "massage": "로그인 성공"
            });
        } else {
            return res.status(402).json({
                "success": false,
                "massage": "아이디 비번 다름"
            });
        }

        //     else {
        //       // user id 없으면
        //       return res.status(403).json({
        //         "success": false,
        //         "masseage": "아이디나 비밀번호가 다릅니다."
        //       });
        //     }
        //   }

    } catch (err) {
        console.log(err, '에러')
        return res.status(400).json({ // 400 : 잘못된 요청
            "success": false,
            "message": "회원 가입 대실패"
        });
    }
});
//3. **로그인 성공 시**, JWT AccessToken을 생성하여 반환합니다.
// - Access Token
// - Payload: userId를 담고 있습니다.
// - 유효기한: 12시간


//수정
router.put("/users", authMiddleware, async (req, res) => { //authMiddleware 가 생김
    try { // 이거 안 쓰면 바로 프로그램 중단 됨
        const { email, password, newpassword } = req.body;
        if (!email || !password || !newpassword) {
            return res.status(401).json({
                "success": false,
                "message": "데이타 형식이 올바르지 않음"
            });
        }
        const result = await Users.findOne({ email });
        if (result.password === password) {
            await Users.updateOne(
                { email },
                { $set: { password: newpassword } }// 새 비번으로 변경
            )
            return res.status(200).json({
                "success": true,
                "massage": "회원정보 수정!"
            });
        } else {
            res.status(402).json({
                "success": false,
                "massage": "비밀번호가 다름!"
            })
        }
    }
    catch {
        res.status(400).json({
            "success": false,
            "massage": "회원정보 수정 불가"
        })
    }
});

//삭제
router.delete("/users", authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                "success": false,
                "message": "데이터형식이 올바르지 않음."
            });
        }
        const result = await User.findOne({ email });
        if (result.password === password) {
            await User.deleteOne({ email });
            return res.status(200).json({
                "success": true,
                "massage": "회원 정보를 삭제했음."
            });
        }
        else {
            res.status(402).json({
                "success": false,
                "massage": "회원 정보가 맞지 않음"
            });
        }
    }
    catch {
        return res.status(400).json({
            "success": false,
            "massage": "회원 정보를 삭제 할 수 없음."
        });
    }
})


//로그아웃

router.get("/users/out",authMiddleware, async (req, res) => {
    try {
        res.clearCookie("Authorization");
        res.status(200).json({
            "success": true,
            "massage": "로그아웃에 성공하였음."
        });
    }
    catch {
        return res.status(400).json({
            "success": false,
            "massage": "로그아웃에 실패했음"
        });
    }
});

module.exports = router;