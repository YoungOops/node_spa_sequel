const jwt = require("jsonwebtoken"); // 토큰 암튼 토큰
const express = require("express"); 
// jsonwebtoken 라이브러리는 JSON Web Token(JWT)을 생성하고 검증하는 기능을 제공
const router = express.Router();
const { Users } = require("../models"); // Router 함수를 호출하여 router라는 객체
// 웹 서버의 라우팅을 설정할 수 있음.
const encrypt = require("../encrypt/encrypt.js"); // 암호화하다. 인크립트

const authMiddleware = require("../middlewares/auth-middleware"); //미들웨어

//회원가입
//로긴
//수정
//삭줴
//로가웃

module.exports = reuter;