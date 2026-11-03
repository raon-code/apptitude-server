/**
 * device-service.js
 *  기기관련 서비스
 */
const UserDevice = require('@/models/user-device');

const logger = require('@/config/logger');

const { NotFoundError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

const CreateUserDeviceDTO = require('@/types/dto/create-user-device-dto');

/**
 * 사용자 기기 생성
 *
 * 새로 등록한 기기는 현재 사용 중인 기기로 설정한다.
 *
 * @param {CreateUserDeviceDTO} createUserDeviceDTO
 * @returns {UserDevice} 새로 추가된 사용자 기기 정보
 */
async function createUserDevice(createUserDeviceDTO) {
  createUserDeviceDTO.isUsing = true;

  const newUserDevice = await UserDevice.create(createUserDeviceDTO);
  logger.debug(newUserDevice);

  return newUserDevice;
}

/**
 * 사용자 기기 목록 조회
 *
 * @param {*} userId
 * @returns
 */
async function getUserDeviceList(userId) {
  const userDeviceList = await UserDevice.findAll({
    where: {
      userId
    }
  });
  logger.debug(userDeviceList);

  return userDeviceList;
}

/**
 * 사용자 기기 조회
 *
 * 없으면 NotFoundError, 본인 기기가 아니면 UnauthorizeError
 *
 * @param {number} userId 사용자 ID
 * @param {number} userDeviceId 사용자 기기 ID
 * @returns {UserDevice} 사용자 기기 정보
 */
async function getUserDevice(userId, userDeviceId) {
  const userDevice = await UserDevice.findByPk(userDeviceId);
  logger.debug(userDevice);

  if (!userDevice) {
    throw new NotFoundError('사용자 기기를 찾을 수 없습니다.');
  }

  if (userDevice.userId !== userId) {
    throw new UnauthorizeError('사용자 기기 정보에 접근할 권한이 없습니다');
  }

  return userDevice;
}

module.exports = {
  createUserDevice,
  getUserDeviceList,
  getUserDevice
};
