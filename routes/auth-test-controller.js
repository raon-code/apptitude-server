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
 * /api/auth/protected
 */
router.get('/protected', afterProtected);
async function afterProtected(req, res) {
  // 인증 미들웨어로부터 넘겨받은 유저 정보
  // logger.debug(req.user);
  response(res, StatusCodes.OK, 'Auth success');
}

module.exports = router;
