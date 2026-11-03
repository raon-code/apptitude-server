/**
 * user-service.js
 *  사용자 관련 서비스
 */
const User = require('@/models/user');

const logger = require('@/config/logger');

const CreateUserDTO = require('@/types/dto/create-user-dto');
const UpdateUserDTO = require('@/types/dto/update-user-dto');
const CreateLoginPlatformDTO = require('@/types/dto/create-login-platform-dto');
const loginPlatformService = require('@/services/login-platform-service');
const { reissue } = require('@/services/session-service');
const { ConflictError, NotFoundError, UnauthorizeError } = require('@/error');
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
 * 사용자와 로그인 플랫폼을 함께 생성
 *
 * 이미 가입된 로그인 플랫폼이면 ConflictError
 *
 * @param {CreateUserDTO} createUserDTO 사용자 생성 DTO
 * @returns {{newUser: User, newLoginPlatform: LoginPlatform}} 생성된 사용자, 로그인 플랫폼
 */
async function createUserWithLoginPlatform(createUserDTO) {
  // 회원가입 여부 체크
  const loginPlatform = await loginPlatformService.getLoginPlatformByColumn(
    createUserDTO.loginPlatform.uuid,
    createUserDTO.loginPlatform.platformType
  );
  if (loginPlatform) {
    throw new ConflictError('이미 가입된 사용자입니다.');
  }

  // 유저 생성
  const newUser = await createUser(createUserDTO);

  // 로그인 플랫폼 생성
  const createLoginPlatformDTO = CreateLoginPlatformDTO.fromPlainObject({
    ...createUserDTO.loginPlatform,
    userId: newUser.id
  });
  createLoginPlatformDTO.validate();
  const newLoginPlatform = await loginPlatformService.createLoginPlatform(
    createLoginPlatformDTO
  );

  return { newUser, newLoginPlatform };
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
 * 사용자 조회, 사용자가 없으면 NotFoundError
 *
 * @param {string} userId 사용자 ID
 * @returns {User} 사용자 정보
 */
async function getUserOrThrow(userId) {
  const user = await getUser(userId);
  if (!user) {
    throw new NotFoundError('사용자를 찾을 수 없습니다.');
  }

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
    logger.error(`유저 ID 다름. userID: ${userId}, user: ${user.id}`);
    throw new UnauthorizeError('사용자 정보가 올바르지 않습니다.');
  }
}

/**
 * 사용자 정보 수정
 *
 * @param {User}         user           사용자
 * @param {UpdateUserDTO} dtoUpdateUser  사용자 수정 DTO
 * @returns {User} 수정된 사용자 정보
 */
async function updateUser(user, dtoUpdateUser) {
  updateProperties(user, dtoUpdateUser);
  await user.update();
  return user;
}

/**
 * 사용자 정보 수정 후 액세스 토큰 재발급
 *
 * @param {string} userId 사용자 ID
 * @param {UpdateUserDTO} updateUserDTO 사용자 수정 DTO
 * @returns {{updatedUser: User, newAccessToken: string}} 수정된 사용자 정보, 재발급한 액세스 토큰
 */
async function updateUserWithReissue(userId, updateUserDTO) {
  const user = await getUserOrThrow(userId);
  const updatedUser = await updateUser(user, updateUserDTO);

  // 정보가 바뀌었으므로 토큰 재발급
  const newAccessToken = await reissue(updatedUser.refreshJwt);

  return { updatedUser, newAccessToken };
}

module.exports = {
  createUser,
  createUserWithLoginPlatform,
  getUser,
  getUserOrThrow,
  isOwnUserId,
  updateUser,
  updateUserWithReissue
};
