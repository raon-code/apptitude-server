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

function generateJwtRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.refresh);
}

function getJwtPayload(token) {
  // TODO: try catch가 필요한가?
  const decoded = jwt.decode(token);
  return decoded || null;
}

function isJwtTokenExpired(exp) {
  const now = new Date().getTime() / 1000;
  return now > exp;
}

function setJwtTokenCookie(res, token) {
  res.cookie(jwtConfig.cookie.name, token, jwtConfig.cookie.option);
}

function getJwtTokenCookie(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
}

function clearJwtTokenCookie(res) {
  res.clearCookie(jwtConfig.cookie.name);
}

module.exports = {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  getJwtPayload,
  isJwtTokenExpired,
  setJwtTokenCookie,
  getJwtTokenCookie,
  clearJwtTokenCookie
};
