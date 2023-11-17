const CryptoJS = require("crypto-js"); //crypto-js'라는 외부 라이브러리를 불러오는 부분

module.exports = (password) => {
    return CryptoJS.SHA3(password, "secret-key").toString();
}

//이 부분은 함수를 정의하고, 이 함수를 다른 곳에서도 사용할 수 있게 내보내는 부분입니다. 이 함수는 'password'라는 인자를 받습니다.
//이 부분에서는 'CryptoJS' 도구상자 안의 'SHA3'라는 도구를 사용해서 'password'를 암호화합니다. 
//마지막으로 toString()은 암호화된 결과를 문자열 형태로 바꿔주는 역할을 합니다.