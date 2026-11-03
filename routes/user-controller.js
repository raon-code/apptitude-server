/**
 * user-controller.js
 *  사용자 관련 컨트롤러
 *
 * BASE URI: /users
 *
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const transaction = require('@/middleware/transaction-handler');

const { setJwtTokenCookie } = require('@/config/security/jwt');

const userService = require('@/services/user-service');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const UpdateUserDTO = require('@/types/dto/update-user-dto');

router.use((req, res, next) => {
  if (shouldSkipAuth(req)) {
    return next();
  }
  return authMiddleware(req, res, next);
});

// :id 라우트에서만 본인 여부를 검증한다.
// router-level 미들웨어에서는 req.params.id가 비어 있어 검증이 항상 건너뛰어진다.
router.param('id', (req, res, next, id) => {
  const userId = Number(id);
  if (userId) {
    userService.isOwnUserId(userId, req.user);
  }
  next();
});

// Auth 미들웨어를 제외할 경로를 확인하는 함수
function shouldSkipAuth(req) {
  return req.method === 'POST' && req.path === '/';
}

router.post('/', transaction(createUser)); // *트랜잭션 처리*
async function createUser(req, res) {
  const createUserDTO = CreateUserDTO.fromPlainObject(req.body);
  createUserDTO.validate();

  const { newUser, newLoginPlatform } =
    await userService.createUserWithLoginPlatform(createUserDTO);

  response(res, StatusCodes.CREATED, '생성성공', {
    newUser,
    newLoginPlatform
  });
}

router.get('/:id(\\d+)', getUser);
async function getUser(req, res) {
  const user = await userService.getUserOrThrow(req.params.id);

  response(res, StatusCodes.OK, '조회성공', user);
}

//  JWT 토큰으로 사용자 정보를 저장하고 있으므로
//  갱신을 위해 수정시 엑세스토큰을 재발급 받아야함

router.patch('/:id(\\d+)', updateUser);
async function updateUser(req, res) {
  const updateUserDTO = UpdateUserDTO.fromPlainObject(req.body);
  updateUserDTO.validate();

  const { updatedUser, newAccessToken } =
    await userService.updateUserWithReissue(req.params.id, updateUserDTO);

  setJwtTokenCookie(res, newAccessToken);
  response(res, StatusCodes.OK, '수정성공', updatedUser);
}

module.exports = router;
