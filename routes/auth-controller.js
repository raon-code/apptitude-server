/**
 * 자격 증명을 위한 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');

const kakao = require('@/third-party/kakao/auth');
const logger = require('@/config/logger');

router.get('/kakao/login', getKakaoLoginPage);
async function getKakaoLoginPage(req, res) {
  res.redirect(kakao.getAuthUrl());
}

router.get('/kakao/token', getKakaoToken);
async function getKakaoToken(req, res) {
  const { code } = req.query;

  const data = await kakao.getToken(code);
  response(res, StatusCodes.OK, '조회성공', data);
}

router.get('/kakao/user', getKakaoUser);
async function getKakaoUser(req, res) {
  const { accessToken } = req.query;

  const data = await kakao.getUserInfo(accessToken);
  response(res, StatusCodes.OK, '조회성공', data);
}

router.get('/kakao/result', getKakaoResult);
async function getKakaoResult(req, res) {
  const { code } = req.query;

  const token = await kakao.getToken(code);
  logger.debug(token);

  const accessToken = token.access_token;
  const data = await kakao.getUserInfo(accessToken);
  logger.debug(data);

  response(res, StatusCodes.OK, '조회성공', data);
}

module.exports = router;
