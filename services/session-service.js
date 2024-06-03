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
const { sequelize } = require('@/models');

/**
 * 로그인
 *
 * @param {LoginUserDTO} loginUserDTO
 * @returns {String} 액세스 토큰
 */
async function login(loginUserDTO) {
  const transaction = await sequelize.transaction();

  try {
    // 로그인 플랫폼 타입, uuid값으로 사용자를 찾음
    const loginPlatform = await LoginPlatform.findOne({
      where: {
        platformType: loginUserDTO.platformType,
        uuid: loginUserDTO.uuid
      },
      transaction
    });
    if (isEmpty(loginPlatform)) {
      logger.error(
        '존재하지 않는 사용자 입니다.\n' +
          `플랫폼: ${loginUserDTO.platformType}, UUID: ${loginUserDTO.uuid}`
      );
      throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
    }
    logger.debug(loginPlatform);

    // 사용자 정보 조회, 로그인 플랫폼으로부터
    const user = await User.findByPk(loginPlatform.userId, { transaction });
    if (isEmpty(user)) {
      logger.error(
        '사용자 정보가 존재하지 않습니다.' +
          `사용자 ID: ${loginPlatform.userId}`
      );
      throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
    }

    // 갱신 토큰: 엑세스 토큰 재발급을 위한 값
    // 갱신 토큰값 생성, 사용자의 테이블에서 업데이트
    const newRefreshJwt = generateJwtRefreshToken({});
    user.refreshJwt = newRefreshJwt;
    user.lastLogin = new Date();

    // 갱신토큰값, 마지막 로그인 시간 업데이트
    await user.save({ transaction });
    logger.debug(user);

    // 엑세스 토큰: API에 접근 가능
    // Sequelize 객체, dataValues: 현재 값
    const newAccessToken = generateJwtAccessToken({ ...user.dataValues });

    await transaction.commit();
    return newAccessToken;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// TODO: 재발급
function reissue() {
  // 리프레시 토큰을 이용해 엑세스 토큰 재발급
  const newRefreshJwt = generateJwtRefreshToken({});
}

// TODO: 로그아웃
async function logout() {
  // 엑세스 토큰 비활성화
  // 리프레시 토큰 비활성화
}

module.exports = { login, reissue, logout };
