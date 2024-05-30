/**
 * session-service.js
 *  세션 서비스
 */
const User = require('@/models/user');
const LoginPlatform = require('@/models/login-platform');

const logger = require('@/config/logger');

const { BizError } = require('@/error');

const {
  generateJwtAccessToken,
  generateJwtRefreshToken
} = require('@/config/security/jwt');

const LoginUserDTO = require('@/types/dto/login-user-dto');
const { isEmpty } = require('@/common/validate');

/**
 * 로그인
 * @param {LoginUserDTO} loginUserDTO
 * @returns {String} 액세스 토큰
 */
async function login(loginUserDTO) {
  // 로그인 플랫폼 타입, uuid값으로 사용자를 찾음
  const loginPlatform = await LoginPlatform.findOne({
    where: {
      platformType: loginUserDTO.platformType,
      uuid: loginUserDTO.uuid
    }
  });
  if (isEmpty(loginPlatform)) {
    logger.error(
      '존재하지 않는 사용자 입니다.\n' +
        `플랫폼: ${loginUserDTO.platformType}, UUID: ${loginUserDTO.uuid}`
    );
    throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
  }

  // 사용자 정보 조회
  const user = await User.findByPk(loginPlatform.userId);
  if (isEmpty(user)) {
    logger.error(
      '사용자 정보가 존재하지 않습니다.' + `사용자 ID: ${loginPlatform.userId}`
    );
    throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
  }

  // 갱신 토큰값 생성, 사용자의 테이블에서 업데이트
  const newRefreshJwt = generateJwtRefreshToken({});
  user.refreshJwt = newRefreshJwt;
  user.lastLogin = new Date();

  await User.update(
    {
      refreshJwt: user.refreshJwt, // 갱신 토큰값 업데이트
      lastLogin: user.lastLogin // 로그인 날짜 기록
    },
    { where: { id: user.id } }
  );

  // 사용자 엑세스 토큰 발급
  const newAccessToken = generateJwtAccessToken(user);
  return newAccessToken;
}

// TODO: 로그아웃
async function logout() {
  // 엑세스 토큰 비활성화
  // 리프레시 토큰 비활성화
}

// TODO: (private)

module.exports = {};
