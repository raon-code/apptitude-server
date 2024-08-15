/**
 * 자격 증명을 위한 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');

const kakao = require('@/third-party/kakao/auth');
const logger = require('@/config/logger');

/**
 * @swagger
 * /auth/kakao/login:
 *   get:
 *     summary: 카카오 로그인 페이지(swagger에서 테스트 불가)
 *     description:
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 카카오 로그인 페이지로 리다이렉트
 */
router.get('/kakao/login', getKakaoLoginPage);
async function getKakaoLoginPage(req, res) {
  res.redirect(kakao.getAuthUrl());
}

/**
 * @swagger
 * /auth/kakao/token:
 *   get:
 *     summary: 카카오 토큰 요청
 *     description:
 *     tags: [Auth]
 *     parameters:
 *      - in: query
 *        name: code
 *        required: true
 *        description: 인가 코드
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: 카카오 토큰 발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "발급 성공"
 *                 data:
 *                   type: object
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/kakao/token', getKakaoToken);
async function getKakaoToken(req, res) {
  const { code } = req.query;

  const { data } = await kakao.getToken(code);
  response(res, StatusCodes.OK, '카카오 토큰 발급 성공', data);
}

/**
 * @swagger
 * /auth/kakao/user:
 *   get:
 *     summary: 카카오 유저 정보 요청
 *     description:
 *     tags: [Auth]
 *     parameters:
 *      - in: query
 *        name: accessToken
 *        required: true
 *        description: 접근토큰
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "유저 조회 성공"
 *                 data:
 *                   type: object
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/kakao/user', getKakaoUser);
async function getKakaoUser(req, res) {
  const { accessToken } = req.query;

  const { data } = await kakao.getUserInfo(accessToken);
  response(res, StatusCodes.OK, '카카오 유저 정보 조회 성공', data);
}

// 카카오 서버가 요청하는 URL
router.get('/kakao/user/test', getKakaoUserTest);
async function getKakaoUserTest(req, res) {
  const { code } = req.query;
  // TODO: getKakaoAuth
  // TODO: getKakaoUser
}

module.exports = router;
