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

router.post('/', transaction(createSession));
async function createSession(req, res) {
  const loginUserDTO = LoginUserDTO.fromPlainObject(req.body);
  loginUserDTO.validate();

  const accessToken = await sessionService.login(loginUserDTO);

  // 액세스 토큰을 쿠키에 저장
  setJwtTokenCookie(res, accessToken);
  response(res, StatusCodes.OK, '세션생성 성공', { accessToken });
}

router.delete('/', authMiddleware, deleteSession);
async function deleteSession(req, res) {
  await sessionService.logout();

  // 액세스 토큰을 쿠키에서 삭제
  clearJwtTokenCookie(res);
  response(res, StatusCodes.NO_CONTENT, '세션삭제 성공');
}

module.exports = router;
