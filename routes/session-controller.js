/**
 * session-controller.js
 *  사용자 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const sessionService = require('@/services/session-service');
const response = require('@/common/response');

const LoginUserDTO = require('@/types/dto/login-user-dto');

/**
 * @swagger
 * /api/sessions:
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
router.post('/', createSession);
async function createSession(req, res) {
  const loginUserDTO = LoginUserDTO.fromPlainObject(req.body);
  loginUserDTO.validate();

  const accessToken = await sessionService.login(loginUserDTO);

  response(res, StatusCodes.OK, '세션생성 성공', { accessToken });
}

module.exports = router;
