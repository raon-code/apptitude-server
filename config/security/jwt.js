/**
 * jwt.js
 *  jwt 토큰 설정을 담습니다.
 *
 */
const jwt = require('jsonwebtoken');

const jwtConfig = require('@/config').jwt;

function generateJwtAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.access);
}

function reissueJwtAccessToken() {}

function generateJwtRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.refresh);
}

module.exports = {
  generateJwtAccessToken,
  generateJwtRefreshToken
};
