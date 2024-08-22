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

const { sequelize } = require('@/models');
const transaction = require('@/middleware/transaction-handler');

const { reissue } = require('@/services/session-service');
const { setJwtTokenCookie } = require('@/config/security/jwt');

const userService = require('@/services/user-service');
const loginPlatformService = require('@/services/login-platform-service');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const CreateLoginPlatformDTO = require('@/types/dto/create-login-platform-dto');
const UpdateUserDTO = require('@/types/dto/update-user-dto');

const { ConflictError, NotFoundError, BizError } = require('@/error');

// 미들웨어를 모든 요청에 적용하되, POST /user 요청을 제외함
router.use((req, res, next) => {
  // [POST] /users 요청(유저생성)은 미들웨어를 적용하지 않음
  if (req.method === 'POST' && req.path === '/') {
    return next();
  }

  // 토큰확인
  authMiddleware(req, res, next);

  // 사용자확인
  const userId = req.params.id;
  if (userId) {
    userService.isOwnUserId(userId, req.user);
  }

  next();
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 사용자를 생성
 *     description: 회원입력 정보를 바탕으로 사용자를 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - gender
 *               - ageRange
 *               - jobType
 *               - jobDetail
 *               - profilePhotoPath
 *             properties:
 *               email:
 *                 type: string
 *                 description: 이메일
 *                 example: sb92120@gmail.com
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *                 example: NoPainNoLife
 *               gender:
 *                 type: string(enum)
 *                 description: 성별(공통코드)
 *                 example: GD1
 *               ageRange:
 *                 type: string(enum)
 *                 description: 연령대(공통코드)
 *                 example: AR2
 *               jobType:
 *                 type: string(enum)
 *                 description: 직업타입(공통코드)
 *                 example: JT0
 *               jobDetail:
 *                 type: string
 *                 description: 직업상세, 직접입력 선택시 활성화
 *                 example: 만년백수
 *               profilePhotoPath:
 *                 type: string
 *                 description: 프로필사진 경로, 호스트 url은 제외
 *                 example: /path/to/the/profile/photo.jpg
 *               loginPlatform:
 *                 type: object
 *                 required:
 *                   - platformType
 *                   - uuid
 *                 properties:
 *                   platformType:
 *                     type: string(enum)
 *                     description: 플랫폼 타입(공통코드)
 *                     example: PT0
 *                   uuid:
 *                     type: string
 *                     description: UUID
 *                     example: 1234567890
 *     responses:
 *       201:
 *         description: 사용자를 성공적으로 생성
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: 'Created'
 *                 data:
 *                   type: object
 *                   description: 생성한 사용자 정보
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', transaction(createUser)); // *트랜잭션 처리*
async function createUser(req, res) {
  const createUserDTO = CreateUserDTO.fromPlainObject(req.body);
  createUserDTO.validate();

  // 회원가입 여부 체크
  const loginPlatform = await loginPlatformService.getLoginPlatformByColumn(
    createUserDTO.loginPlatform.uuid,
    createUserDTO.loginPlatform.platformType
  );
  if (loginPlatform) {
    throw new ConflictError('이미 가입된 사용자입니다.');
  }

  // 유저 생성
  const newUser = await userService.createUser(createUserDTO);
  createUserDTO.loginPlatform.userId = newUser.id;

  // 로그인 플랫폼 생성
  const createLoginPlatformDTO = CreateLoginPlatformDTO.fromPlainObject(
    createUserDTO.loginPlatform
  );
  createLoginPlatformDTO.validate();
  const newLoginPlatform = await loginPlatformService.createLoginPlatform(
    createLoginPlatformDTO
  );

  response(res, StatusCodes.CREATED, '생성성공', {
    newUser,
    newLoginPlatform
  });
}

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: "사용자 조회"
 *     description: "특정 사용자를 조회"
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 사용자 ID
 *         schema:
 *           type: number
 *           example: 1
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
 *                   example: '조회성공'
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: 유저정보
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/:id', getUser);
async function getUser(req, res) {
  const userId = req.params.id;

  const user = await userService.getUser(userId);
  if (!user) {
    throw new NotFoundError('사용자를 찾을 수 없습니다.');
  }

  response(res, StatusCodes.OK, '조회성공', user);
}

//  JWT 토큰으로 사용자 정보를 저장하고 있으므로
//  갱신을 위해 수정시 엑세스토큰을 재발급 받아야함
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: 사용자 정보 수정
 *     description: 사용자 정보를 수정
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 사용자 ID
 *         schema:
 *           type: number
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               none:
 *                 type: string
 *                 description: empty
 *                 example: 'updateDTO 정해지면 채워넣을 예정'
 *     responses:
 *       200:
 *         description: 업데이트 성공
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
 *                   example: "업데이트 성공"
 *                 data:
 *                   type: object
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.patch('/:id', updateUser);
async function updateUser(req, res) {
  const userId = req.params.id;
  const updateUserDTO = UpdateUserDTO.fromPlainObject(req.body);
  updateUserDTO.validate();

  const user = userService.updateUser(userId, updateUserDTO);

  // 정보가 바뀌었으므로 토큰 재발급
  const newAccessToken = await reissue(user.refreshJwt);
  setJwtTokenCookie(res, newAccessToken);

  response(res, StatusCodes.OK, '수정성공', user);
}

module.exports = router;
