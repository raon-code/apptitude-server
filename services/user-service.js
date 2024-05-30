/**
 * user-service.js
 *  사용자 서비스
 */
const User = require('@/models/user');

const logger = require('@/config/logger');

const { BizError } = require('@/error');
const { generateJwtRefreshToken } = require('@/config/security/jwt');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const LoginPlatform = require('@/models/login-platform');

/**
 * 사용자 생성
 *
 * @param {CreateUserDTO} createUserDTO 사용자 생성 DTO
 * @returns {User} 새롭게 생성한 사용자 정보
 */
async function createUser(createUserDTO) {
  // 사용자 생성
  const newUser = await User.create(createUserDTO);
  logger.debug(newUser);

  // 로그인 플랫폼 정보 생성
  const newLoginPlatform = await LoginPlatform.create({
    platformType: createUserDTO.platformType,
    uuid: createUserDTO.uuid,
    userId: newUser.id
  });
  logger.debug(newLoginPlatform);

  return newUser;
}

// TODO: 사용자 수정

// TODO: 사용자 탈퇴(삭제)

module.exports = { createUser };
