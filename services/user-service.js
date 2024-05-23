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
 *
 * @param {CreateUserDTO} createUserDTO
 * @returns {User}
 */
// 사용자 생성
async function createUser(createUserDTO) {
  const newUser = createUserDTO.toObject();

  // 토큰 발급
  // playload는 빈 데이터를 사용합니다.
  newUser.refreshToken = generateJwtRefreshToken({});

  const user = await User.create(newUser);
  logger.debug(user);

  return user;
}

// 사용자 탈퇴
module.exports = { createUser };
