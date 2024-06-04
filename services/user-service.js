/**
 * user-service.js
 *  사용자 서비스
 */
const User = require('@/models/user');

const logger = require('@/config/logger');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const LoginPlatform = require('@/models/login-platform');

/**
 * 사용자 생성
 *
 * @param {CreateUserDTO} createUserDTO 사용자 생성 DTO
 * @returns {User} 새롭게 생성한 사용자 정보
 */
async function createUser(createUserDTO) {
  // 로그인 플랫폼은 사용자와 1:1 관계이므로, 생성된 사용자 정보에 로그인 플랫폼 정보를 추가해준다.
  const newUser = await User.create(createUserDTO, {
    include: [{ model: LoginPlatform, as: 'LoginPlatform' }]
  });
  logger.debug(newUser);

  // TODO: 사용자 기기 정보를 추가해준다.
  const testList = await LoginPlatform.findAll();
  logger.debug(testList);

  return newUser;
}

/**
 * 사용자 조회
 *
 */
async function getUser() {}

// TODO: 사용자 수정
//  JWT 토큰으로 사용자 정보를 저장하고 있으므로
//  갱신을 위해 수정시 엑세스토큰을 재발급 받아야함

// TODO: 사용자 탈퇴(삭제)

module.exports = { createUser };
