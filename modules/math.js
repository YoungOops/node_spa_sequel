// function add(a, b) {
//     return a + b;
// }

// module.exports = add;

//math.js
//익명 함수.
exports.add = function (a, b) {
        return a + b;
}
// 이거는 객체로 내보내주게 된다.

function add (a, b) {
        return a + b;
}
module.exports = {add : add};


// 모듈을 호출했을 때, add 키 값에는 (a,b)treturn a + b;} 익명함수가 할당되는 방법이다.
// exports.add = function(a, b){
// return a + b;
// }

// 모듈을 호출했을 때, add 키 값에는 add 함수가 들어가는 방법이다.
// module. exports = { add : add};

// 모듈 그 자체를 바로 add 함수를 할당한다.
// module. exports = add;

// 변수에 할당 된 익명함수 내보내줄 수 있다
const add = (a, b) => { //a,b 라는 인자를 받는 const add 라는 화살표 함수를 만들고
    return a + b;
}

exports.add = add;