/**
 * user-service.js
 *  사용자 서비스
 */
const User = require('@/models/user');
const logger = require('@/config/logger');

const { BizError } = require('@/error');
const { isEmpty } = require('@/common/validate');
const { GENDER } = require('@/enum/gender');
const { generateJwtRefreshToken } = require('@/config/security/jwt');

const CreateUserDTO = require('@/types/dto/create-user-dto');

/**
 * 사용자 생성
 *
 * @param {CreateUserDTO} createUserDTO 사용자 생성 DTO
 * @returns {User} 새롭게 생성한 사용자 정보
 */
async function createUser(createUserDTO) {
  // 토큰 발급: payload 빈 데이터를 사용
  createUserDTO.refreshJtw = generateJwtRefreshToken({});

  const newUser = await User.create(createUserDTO);
  logger.debug(newUser);

  return user;
}

// TODO: 사용자 수정

// TODO: 사용자 탈퇴(삭제)

module.exports = { createUser };
