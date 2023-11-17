const CryptoJS = require("crypto-js");

module.exports = (password) => {
    return CryptoJS.SHA3(password, "secret-key").toString();
}