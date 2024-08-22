/**
 * user-controller.js
 *  사용자 관련 컨트롤러
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
const friendService = require('@/services/friend-service');
const deviceService = require('@/services/device-service');
const loginPlatformService = require('@/services/login-platform-service');
const battleService = require('@/services/battle-service');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const CreateLoginPlatformDTO = require('@/types/dto/create-login-platform-dto');
const CreateUserDeviceDTO = require('@/types/dto/create-user-device-dto');
const UpdateUserDTO = require('@/types/dto/update-user-dto');
const { create } = require('@/models/user');

// 미들웨어를 모든 요청에 적용하되, POST /user 요청을 제외함
router.use((req, res, next) => {
  // [POST] /users 요청(유저생성)은 미들웨어를 적용하지 않음
  if (req.method === 'POST' && req.path === '/') {
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

  // 회원가입 여부 체크
  const loginPlatform = await loginPlatformService.getLoginPlatformByColumn(
    createUserDTO.loginPlatform.uuid,
    createUserDTO.loginPlatform.platformType
  );
  if (loginPlatform) {
    response(res, StatusCodes.CONFLICT, 'Conflict', {
      message: '이미 가입된 회원입니다.'
    });
    return;
  }

  // 유저 생성
  createUserDTO.validate();
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

  // 정보가 바뀌었으므로 토큰 재발급
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

/**
 *  @swagger
 *  /users/{id}/friends:
 *    get:
 *      summary: 친구 목록 조회
 *      description: 사용자의 친구 목록을 조회
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: 사용자 ID
 *          schema:
 *            type: number
 *        - in: query
 *          name: filterType
 *          required: false
 *          description: 필터 타입
 *          schema:
 *            type: string
 *        - in: query
 *          name: orderType
 *          required: false
 *          description: 정렬 타입 (asc/desc)
 *          schema:
 *            type: string
 *        - in: query
 *          name: orderBy
 *          required: false
 *          description: 정렬 기준 필드
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: false
 *          description: 페이지 번호
 *          schema:
 *            type: integer
 *        - in: query
 *          name: size
 *          required: false
 *          description: 페이지 당 항목 수
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: 사용자의 전체 친구 목록
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 조회성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.get('/:id(\\d+)/friends', authMiddleware, verifyUser, getFriendList);
async function getFriendList(req, res) {
  const userId = req.params.id;

  // TODO: 필터 타입 추가
  const filterType = req.query.filterType;
  // TODO: 정렬 기준 추가
  const orderType = req.query.orderType;

  // 정렬기준
  const orderBy = req.query.orderBy;
  // 인덱싱용 페이지 - 어디서부터 보여줄지
  const page = req.query.page;
  // 보여줄 친구 수
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
 * /{id}/friends/{friendPkId}:
 *   get:
 *     summary: 특정 친구 조회
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: friendPkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 친구 PK ID
 *     responses:
 *       200:
 *          description: 친구 조회 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 친구 정보
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data

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
 * /{id}/friends:
 *   delete:
 *     summary: 친구 삭제
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: body
 *         name: friendPkIdList
 *         description: 삭제할 친구의 PK ID 목록
 *         schema:
 *           type: object
 *           properties:
 *             friendPkIdList:
 *               type: array
 *               items:
 *                 type: integer
 *     responses:
 *        200:
 *          description: 친구 삭제 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 삭제 결과
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data
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

/**
 * @swagger
 * /{id}/friends/{friendPkId}:
 *   delete:
 *     summary: 특정 친구 삭제
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: friendPkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 친구 PK ID
 *     responses:
 *       200:
 *          description: 친구 삭제 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 삭제 결과
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data
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

/**
 *  @swagger
 *  /{id}/devices:
 *    post:
 *      summary: 유저 디바이스 생성
 *      tags:
 *        - Devices
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *           type: integer
 *          required: true
 *          description: 사용자 ID
 *      requestBody:
 *        description: New device information
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - uuid
 *                - osType
 *                - osVersion
 *              properties:
 *                uuid:
 *                  type: string
 *                  description: 디바이스 식별 코드
 *                  example: 00000000-0000-0000-0000-000000000000
 *                osType:
 *                  type: string(enum)
 *                  description: 운영체제 타입(공통코드)
 *                  example: OT0
 *                osVersion:
 *                  type: string
 *                  description: 운영체제 버전
 *                  example: 14.0.1
 *      responses:
 *        201:
 *          description: Successfully created device
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  statusCode:
 *                    type: integer
 *                    example: 201
 *                  message:
 *                    type: string
 *                    example: Created
 *                  data:
 *                    type: object
 *                    description: 생성한 디바이스 정보
 *                required:
 *                  - statusCode
 *                  - message
 *                  - data
 */
router.post('/:id(\\d+)/devices', createUserDevice);
async function createUserDevice(req, res) {
  const userId = req.params.id;

  const createUserDeviceDTO = CreateUserDeviceDTO.fromPlainObject(req.body);
  createUserDeviceDTO.userId = userId;
  createUserDeviceDTO.isUsing = true;
  createUserDeviceDTO.validate();

  const newUserDevice = await deviceService.createUserDevice(
    createUserDeviceDTO
  );
  response(res, StatusCodes.CREATED, 'Created', newUserDevice);
}

/**
 * @swagger
 * /{id}/devices/{deviceId}:
 *   get:
 *     summary: 특정 사용자 디바이스 조회
 *     tags:
 *       - Devices
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 아이디
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 디바이스 아이디
 *     responses:
 *       200:
 *         description: 디바이스 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: object
 *                   description: Device information
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/:id(\\d+)/devices/:deviceId(\\d+)', getUserDevice);
async function getUserDevice(req, res) {
  const deviceId = req.params.deviceId;

  const userDevice = await deviceService.getUserDevice(deviceId);

  response(res, StatusCodes.OK, 'Ok', userDevice);
}

/**
 * @swagger
 * /{id}/login-platforms:
 *   post:
 *     summary: 유저 로그인 플랫폼 생성
 *     tags:
 *       - Login Platforms
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *     requestBody:
 *       description: 생성한 로그인 플랫폼 정보
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
 *                 description: 플랫폼 타입(공통코드)
 *                 example: PT0
 *               uuid:
 *                 type: string
 *                 description: UUID
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: 로그인 플랫폼 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Created
 *                 data:
 *                   type: object
 *                   description: 생성한 로그인 플랫폼 정보
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/:id(\\d+)/login-platforms', createLoginPlatform);
async function createLoginPlatform(req, res) {
  const userId = req.params.id;

  const createLoginPlatformDTO = CreateLoginPlatformDTO.fromPlainObject(
    req.body
  );
  createLoginPlatformDTO.userId = userId;
  createLoginPlatformDTO.validate();

  const newLoginPlatform = await loginPlatformService.createLoginPlatform(
    createLoginPlatformDTO
  );
  response(res, StatusCodes.CREATED, 'Created', newLoginPlatform);
}

/**
 * @swagger
 * /{id}/battles:
 *   get:
 *     summary: 대결 목록 조회
 *     tags:
 *       - Battles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 대결 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 *                   description: 대결 목록
 *                   items:
 *                     type: object
 *                     example: [{}]
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/:id(\\d+)/battles', getBattleList);
async function getBattleList(req, res) {
  const userId = req.params.id;
  const battleList = await battleService.getBattleList(userId);

  response(res, StatusCodes.OK, 'Ok', battleList);
}

module.exports = router;
