/**
 * jwt.js
 *  jwt 토큰 설정
 */
const jwt = require('jsonwebtoken');

const jwtConfig = require('@/config').jwt;

/**
 * jwt 엑세스용 토큰 생성
 * 
 * @param {object} payload 토큰에 담을 정보
 * @returns jwt 액세스 토큰
 */
function generateJwtAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.access);
}

/**
 * jwt 갱신용 토큰 생성
 * 
 * @param {object} payload 토큰에 담을 정보
 * @returns jwt 리프레시 토큰
 */
function generateJwtRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.option.refresh);
}

/**
 * jwt 토큰에 담긴 정보 조회(payload)
 * 
 * @param {string} token jwt 토큰
 * @returns jwt payload
 */
function getJwtPayload(token) {
  // TODO: try catch가 필요한가?
  const decoded = jwt.decode(token);
  return decoded || null;
}

/**
 * jwt 토큰이 만료되었는지 확인
 * 
 * @param {Date} exp jwt 토큰 만료시간
 * @returns 만료되었으면 true, 아니면 false
 */
function isJwtTokenExpired(exp) {
  const now = new Date().getTime() / 1000;
  return now > exp;
}

/**
 * jwt 토큰을 쿠키에 저장
 * 
 * @param {Response} res 응답 객체
 * @param {string} token jwt 토큰
 */
function setJwtTokenCookie(res, token) {
  res.cookie(jwtConfig.cookie.name, token, jwtConfig.cookie.option);
}

/**
 * jwt 토큰 쿠키에서 가져오기
 * 
 * @param {Request} req 요청 객체
 * @returns jwt 토큰
 */
function getJwtTokenCookie(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
}

/**
 * jwt 토큰 쿠키에서 삭제
 * 
 * @param {Response} res 응답 객체
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
