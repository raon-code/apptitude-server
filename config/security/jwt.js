/**
 * jwt.js
 *  jwt 토큰 설정을 담습니다.
 *
 */
const jwt = require('jsonwebtoken');

const jwtConfig = require('@/config').jwt;

/**
 *
 * @param {*} payload
 * @returns
 */
function generateJwtAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.access);
}

/**
 *
 * @param {*} payload
 * @returns
 */
function generateJwtRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.refresh);
}

/**
 *
 * @param {*} token
 * @returns
 */
function getJwtPayload(token) {
  // TODO: try catch가 필요한가?
  const decoded = jwt.decode(token);
  return decoded || null;
}

/**
 *
 * @param {*} exp
 * @returns
 */
function isJwtTokenExpired(exp) {
  const now = new Date().getTime() / 1000;
  return now > exp;
}

/**
 *
 * @param {*} res
 * @param {*} token
 */
function setJwtTokenCookie(res, token) {
  res.cookie(jwtConfig.cookie.name, token, jwtConfig.cookie.option);
}

/**
 *
 * @param {*} req
 * @returns
 */
function getJwtTokenCookie(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
}

/**
 *
 * @param {*} res
 */
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
