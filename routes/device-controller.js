/**
 * device-controller.js
 *  기기 관련 컨트롤러
 *
 *  BASE URI: /devices
 *
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const userService = require('@/services/user-service');
const deviceService = require('@/services/device-service');

const CreateUserDeviceDTO = require('@/types/dto/create-user-device-dto');

const { ConflictError, NotFoundError, BizError } = require('@/error');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

/**
 *  @swagger
 *  /devices:
 *    post:
 *      summary: 유저 디바이스 생성
 *      tags:
 *        - Devices
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
router.post('/', createUserDevice);
async function createUserDevice(req, res) {
  const userId = req.user.id;

  const createUserDeviceDTO = CreateUserDeviceDTO.fromPlainObject(req.body);
  createUserDeviceDTO.userId = userId;
  createUserDeviceDTO.isUsing = true;
  createUserDeviceDTO.validate();

  const newUserDevice = await deviceService.createUserDevice(
    createUserDeviceDTO
  );
  response(res, StatusCodes.CREATED, '생성성공', newUserDevice);
}

/**
 * @swagger
 * /devices/{deviceId}:
 *   get:
 *     summary: 특정 사용자 디바이스 조회
 *     tags:
 *       - Devices
 *     parameters:
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
router.get('/:deviceId(\\d+)', getUserDevice);
async function getUserDevice(req, res) {
  const deviceId = req.params.deviceId;

  const userDevice = await deviceService.getUserDevice(deviceId);
  if (!userDevice) {
    throw new NotFoundError('사용자 기기를 찾을 수 없습니다.');
  }

  response(res, StatusCodes.OK, '조회성공', userDevice);
}

module.exports = router;
