/**
 * user-service.js
 *  사용자 관련 서비스
 */
const User = require('@/models/user');

const logger = require('@/config/logger');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const UpdateUserDTO = require('@/types/dto/update-user-dto');
const LoginPlatform = require('@/models/login-platform');
const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

/*********************************************
 *                   USER                    *
 *********************************************/
/**
 * 사용자 생성
 *
 * @param {CreateUserDTO} createUserDTO 사용자 생성 DTO
 * @returns {User} 새롭게 생성한 사용자 정보
 */
async function createUser(createUserDTO) {
  // 로그인 플랫폼은 사용자와 1:1 관계이므로, 생성된 사용자 정보에 로그인 플랫폼 정보를 추가해준다.
  const newUser = await User.create(createUserDTO);
  logger.debug(newUser);

  return newUser;
}

/**
 * 사용자 목록 조회
 *
 * @returns {User[]} 사용자 목록
 */
async function getUserList() {
  const userList = await User.findAll();
  logger.debug(userList);

  return userList;
}

/**
 * 사용자 조회
 *
 * @param {string} userId 사용자 ID
 * @returns {User} 사용자 정보
 */
async function getUser(userId) {
  const user = await User.findByPk(userId);
  logger.debug(user);

  return user;
}

/**
 * 유저는 자신이 가진 정보만 확인 가능
 * 다른 유저가 다른 유저의 정보를 확인할 수 없어야 함
 * 이를 체크하기 위한 함수
 *
 * @param {number}  userId  사용자 ID
 * @param {User}    user    사용자 정보
 */
function isOwnUserId(userId, user) {
  if (!user) {
    logger.error(`사용자 정보가 없음. userID: ${userId}, user: ${user}`);
    throw new UnauthorizeError('사용자 정보가 없습니다. 재로그인 해주세요.');
  }

  if (userId !== user.id) {
    logger.error(`유저 ID 다름. userID: ${userId}, user: ${user}`);
    throw new UnauthorizeError('사용자 정보가 올바르지 않습니다.');
  }
}

/**
 * 사용자 정보 수정
 *
 * @param {number}        userId         사용자 ID
 * @param {UpdateUserDTO} dtoUpdateUser  사용자 수정 DTO
 * @returns {User} 수정된 사용자 정보
 */
async function updateUser(userId, dtoUpdateUser) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new BizError('수정할 유저가 존재하지 않습니다.');
  }

  updateProperties(user, dtoUpdateUser);
  await user.update();
  return user;
}

module.exports = { createUser, getUser, isOwnUserId, updateUser };
