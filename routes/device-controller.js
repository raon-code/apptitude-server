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

const deviceService = require('@/services/device-service');

const CreateUserDeviceDTO = require('@/types/dto/create-user-device-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createUserDevice);
async function createUserDevice(req, res) {
  const createUserDeviceDTO = CreateUserDeviceDTO.fromPlainObject({
    ...req.body,
    userId: req.user.id
  });
  createUserDeviceDTO.validate();

  const newUserDevice = await deviceService.createUserDevice(
    createUserDeviceDTO
  );
  response(res, StatusCodes.CREATED, '생성성공', newUserDevice);
}

router.get('/:deviceId(\\d+)', getUserDevice);
async function getUserDevice(req, res) {
  const userDevice = await deviceService.getUserDevice(
    req.user.id,
    req.params.deviceId
  );

  response(res, StatusCodes.OK, '조회성공', userDevice);
}

module.exports = router;
