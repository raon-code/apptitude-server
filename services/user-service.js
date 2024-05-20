/**
 * user-service.js
 *  사용자 서비스
 */
const User = require('@/models/user');
const logger = require('@/config/logger');
const { BizError } = require('@/error');
const { isEmpty } = require('@/common/validate');
const { GENDER } = require('@/enum/gender');
const {
  generateJwtAccessToken,
  generateJwtRefreshToken
} = require('@/config/security/jwt');

// 사용자 생성
async function createUser(createUserDTO) {
  const newUser = createUserDTO.toObject();
  newUser.accessToken = generateJwtAccessToken(newUser);
  newUser.refreshToken = generateJwtRefreshToken(newUser);
  const user = await User.create(newUser);
}

// 사용자 탈퇴
