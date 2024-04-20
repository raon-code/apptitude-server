/**
 * jwt.js
 *  jwt 토큰 설정을 담습니다.
 *
 */
const jwt = require('jsonwebtoken');

const jwtConfig = require('@/config').jwt;

function generateJwtToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option);
}

module.exports = {
  generateJwtToken
};
