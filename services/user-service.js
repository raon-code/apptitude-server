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
    include: [{ model: LoginPlatform, as: 'loginPlatform' }]
  });
  logger.debug(newUser);

  // TODO: 사용자 기기 정보를 추가해준다.
  const testList = await LoginPlatform.findAll();
  logger.debug(testList);

  return newUser;
}

/**
 * 사용자 목록 조회
 * @returns {User[]} 사용자 목록
 */
async function getUserList() {
  const userList = await User.findAll();
  logger.debug(userList);

  return userList;
}

/**
 * 사용자 조회
 * @param {string} userId
 * @returns {User} 사용자 정보
 */
async function getUser(userId) {
  const user = await User.findByPk(userId);
  logger.debug(user);

  return user;
}

module.exports = { createUser };
