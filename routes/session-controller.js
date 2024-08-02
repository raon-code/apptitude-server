/**
 * session-controller.js
 *  세션 관련 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const sessionService = require('@/services/session-service');
const response = require('@/common/response');

const LoginUserDTO = require('@/types/dto/login-user-dto');
const { authMiddleware } = require('@/middleware/auth-handler');
const {
  setJwtTokenCookie,
  clearJwtTokenCookie
} = require('@/config/security/jwt');
const transaction = require('@/middleware/transaction-handler');

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: 세션을 생성(로그인)
 *     description: 로그인 정보를 바탕으로 세션을 생성
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platformType
 *               - uuid
 *             properties:
 *               platformType:
 *                 type: string(enum)
 *                 description: 로그인 플랫폼 타입(공통코드)
 *                 example: PT0
 *               uuid:
 *                 type: string
 *                 description: UUID
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: 세션(토큰기반)을 성공적으로 생성
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
 *                   example: '세션생성 성공'
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: 액세스 토큰
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', transaction(createSession));
async function createSession(req, res) {
  const loginUserDTO = LoginUserDTO.fromPlainObject(req.body);
  loginUserDTO.validate();

  const accessToken = await sessionService.login(loginUserDTO);

  // 액세스 토큰을 쿠키에 저장
  setJwtTokenCookie(res, accessToken);
  response(res, StatusCodes.OK, '세션생성 성공', { accessToken });
}

/**
 * @swagger
 * /sessions:
 *   delete:
 *     summary: 세션을 삭제(로그아웃)
 *     description: 세션을 삭제
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: 세션(토큰기반)을 성공적으로 삭제
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
 *                   example: '세션삭제 성공'
 *               required:
 *                 - statusCode
 *                 - message
 */
router.delete('/', authMiddleware, deleteSession);
async function deleteSession(req, res) {
  sessionService.logout();

  // 액세스 토큰을 쿠키에서 삭제
  clearJwtTokenCookie(res);
  response(res, StatusCodes.NO_CONTENT, '세션삭제 성공');
}

module.exports = router;
