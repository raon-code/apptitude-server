/**
 * user-controller.js
 *  사용자 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const userService = require('@/services/user-service');
const friendService = require('@/services/friend-service');
const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const CreateLoginPlatformDTO = require('@/types/dto/create-login-platform-dto');

const { sequelize } = require('@/models');
const transaction = require('@/middleware/transaction-handler');
const UpdateUserDTO = require('@/types/dto/update-user-dto');
const { reissue } = require('@/services/session-service');
const { setJwtTokenCookie } = require('@/config/security/jwt');

// 미들웨어를 모든 요청에 적용하되, POST /user 요청을 제외함
router.use((req, res, next) => {
  // POST /user 요청(유저생성)은 미들웨어를 적용하지 않음
  if (req.method === 'POST' && req.path === '/user') {
    return next();
  }

  // 토큰확인
  authMiddleware(req, res, next);
  // 사용자 확인
  verifyUser(req, res, next);
});

// 미들웨어: 요청에 대한 사용자 확인
function verifyUser(req, res, next) {
  const userId = req.params.id;

  userService.isOwnUserId(userId, req.user);
  next();
}

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
 *                 - platformType
 *                 - uuid
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
  // 유저 생성
  const createUserDTO = CreateUserDTO.fromPlainObject(req.body);
  createUserDTO.validate();
  const newUser = await userService.createUser(createUserDTO);
  newUser.loginPlatform.userId = newUser.id;

  // 로그인 플랫폼 생성
  const createLoginPlatformDTO = CreateLoginPlatformDTO.fromPlainObject(
    newUser.loginPlatform
  );
  createLoginPlatformDTO.validate();
  const newLoginPlatform = await userService.createLoginPlatform(
    createLoginPlatformDTO
  );

  response(res, StatusCodes.CREATED, 'Created', {
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
router.get('/:id(\\d+)', getUser);
async function getUser(req, res) {
  const userId = req.params.id;

  const user = await userService.getUser(userId);
  response(res, StatusCodes.OK, 'Ok', user);
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
router.patch('/:id(\\d+)', updateUser);
async function updateUser(req, res) {
  const userId = req.params.id;
  const updateUserDTO = UpdateUserDTO.fromPlainObject(req.body);
  updateUserDTO.validate();

  const user = userService.updateUser(userId, updateUserDTO);

  // 토큰 재발급
  const newAccessToken = await reissue(user.refreshJwt);
  setJwtTokenCookie(res, newAccessToken);

  response(res, StatusCodes.OK, 'Ok', user);
}

/**
 * @swagger
 * /users/{id}/friends:
 *  post:
 *    summary: 친구 추가
 *    description: 사용자의 친구를 추가
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: 사용자 ID
 *        schema:
 *          type: number
 *          example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - friendId
 *            properties:
 *              friendId:
 *                type: number
 *                description: 등록할 친구 ID
 *                example: 1
 *    responses:
 *      201:
 *        description: 친구를 성공적으로 생성
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: number
 *                  example: 201
 *                message:
 *                  type: string
 *                  example: 'Created'
 *                data:
 *                  type: object
 *                  description: 생성한 친구 정보
 *                  properties:
 *                    id:
 *                      type: number
 *                      example: 1
 *                    userId:
 *                      type: number
 *                      example: 1
 *                    friendId:
 *                      type: number
 *                      example: 2
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.post('/:id(\\d+)/friends', createFriend);
async function createFriend(req, res) {
  const userId = req.params.id;
  const friendId = req.body.friendId;

  const createFriendDTO = CreateFriendDTO.fromPlainObject({ userId, friendId });
  createFriendDTO.validate();

  const newFriend = friendService.createFriend(createFriendDTO);
  response(res, StatusCodes.CREATED, 'Created', newFriend);
}

// TODO: 사용자 친구 목록 조회
/**
 * @swagger
 * /users/{id}/friends:
 *   get:
 *     summary: 친구 목록 조회
 *     description: 사용자의 친구 목록을 조회
 *     tags: [Users]
 */
router.get('/:id(\\d+)/friends', authMiddleware, verifyUser, getFriendList);
async function getFriendList(req, res) {
  const userId = req.params.id;

  const filterType = req.query.filterType;
  const orderType = req.query.orderType;
  const orderBy = req.query.orderBy;
  const page = req.query.page;
  const size = req.query.size;

  const friendList = friendService.getFriendList(
    userId,
    filterType,
    orderType,
    orderBy,
    page,
    size
  );

  response(res, StatusCodes.OK, 'Ok', friendList);
}

/**
 * @swagger
 * /users/{id}/friends:
 *   delete:
 *     summary: 친구 삭제
 *     description: 친구 선택 및 전체 삭제
 *     tags: [Users]
 */
router.delete(
  '/:id(\\d+)/friends',
  authMiddleware,
  verifyUser,
  deleteFriendList
);
async function deleteFriendList(req, res) {
  const userId = req.params.id;
  const friendPkIdList = req.body.friendPkIdList;

  const result = friendService.deleteFriendList(userId, friendPkIdList);
  response(res, StatusCodes.OK, 'Ok', { result });
}

// TODO: 사용자 친구 조회
/**
 * @swagger
 * /users/{id}/friends/{friendPkId}:
 *   get:
 *     summary: 친구 조회
 *     description: 특정 사용자의 친구를 조회
 *     tags: [Users]
 */
router.get(
  '/:id(\\d+)/friends/:friendPkId(\\d+)',
  authMiddleware,
  verifyUser,
  getFriend
);
async function getFriend(req, res) {
  const userId = req.params.id;
  const friendPkId = req.params.friendPkId;

  const friend = friendService.getFriend(userId, friendPkId);
  response(res, StatusCodes.OK, 'Ok', friend);
}

/**
 * @swagger
 * /users/{id}/friends/{friendPkId}:
 *   delete:
 *     summary: 친구 삭제
 *     description: 특정 사용자의 친구를 삭제
 *     tags: [Users]
 */
router.delete(
  '/:id(\\d+)/friends/:friendPkId(\\d+)',
  authMiddleware,
  verifyUser,
  deleteFriend
);
async function deleteFriend(req, res) {
  const userId = req.params.id;
  const friendPkId = req.params.friendPkId;

  const result = friendService.deleteFriend(userId, friendPkId);
  response(res, StatusCodes.OK, 'Ok', { result });
}

// TODO: 사용자 기기 등록
/**
 * @swagger
 * /users/{id}/devices:
 *   post:
 */
router.post('/:id(\\d+)/devices', createDevice);
async function createDevice(req, res) {
  const userId = req.params.id;

  // TODO: CreateDeviceDTO 추가
  // TODO: createDevice 서비스 추가
}

// TODO: 사용자 기기 조회
/**
 * @swagger
 * /users/{id}/devices/{deviceId}:
 *   get:
 */
router.get('/:id(\\d+)/devices/:deviceId(\\d+)', getDevice);
async function getDevice(req, res) {
  const userId = req.params.id;
  const deviceId = req.params.deviceId;

  // TODO: getDevice 서비스 추가
}

// TODO: 로그인 플랫폼 등록
/**
 * @swagger
 * /users/{id}/login-platforms:
 *   post:
 */
router.post('/:id(\\d+)/login-platforms', createLoginPlatform);
async function createLoginPlatform(req, res) {
  const userId = req.params.id;

  // TODO: CreateLoginPlatformDTO 추가
  // TODO: createLoginPlatform 서비스 추가
}

// TODO: 사용자 배틀 목록 조회
/**
 * @swagger
 * /users/{id}/battles:
 *   get:
 */
router.get('/:id(\\d+)/battles', getBattleList);
async function getBattleList(req, res) {
  const userId = req.params.id;

  // TODO: getBattleList 서비스 추가
}

module.exports = router;
