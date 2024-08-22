/**
 * login-platform-service.js
 *  로그인플랫폼 관련 서비스
 */
const LoginPlatform = require('@/models/login-platform');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const CreateLoginPlatformDTO = require('@/types/dto/create-login-platform-dto');

/**
 * 로그인 플랫폼 생성
 *
 * @param {CreateLoginPlatformDTO} createLoginPlatformDTO 로그인 플랫폼 생성 정보
 * @returns {LoginPlatform} 새롭게 생성한 로그인 플랫폼 정보
 */
async function createLoginPlatform(createLoginPlatformDTO) {
  const newLoginPlatform = await LoginPlatform.create(createLoginPlatformDTO);
  logger.debug(newLoginPlatform);

  return newLoginPlatform;
}

async function getLoginPlatformByColumn(uuid, platformType) {
  const loginPlatform = await LoginPlatform.findOne({
    where: { uuid, platformType }
  });
  logger.debug(loginPlatform);

  return loginPlatform;
}

module.exports = {
  createLoginPlatform,
  getLoginPlatformByColumn
};
