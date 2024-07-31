/**
 * auth.controller.js
 *  인증 컨트롤러
 */
const router = require('express').Router();
const response = require('@/common/response');
const logger = require('@/config/logger');
const { authMiddleware } = require('@/middleware/auth-handler');
const { StatusCodes } = require('http-status-codes');

// 해당 컨트롤러는 인증 미들웨어를 사용합니다.
router.use(authMiddleware);

/**
 * @swagger
 * /auth/tests/protected:
 *   get:
 *     summary: auth 테스트
 *     description: 인증 테스트
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: Test retrieved successfully.
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
 *                   example: 'Auth success'
 *                 data:
 *                   type: object
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/protected', afterProtected);
async function afterProtected(req, res) {
  // 인증 미들웨어로부터 넘겨받은 유저 정보
  // logger.debug(req.user);
  response(res, StatusCodes.OK, 'Auth success', { user: req.user });
}

module.exports = router;
