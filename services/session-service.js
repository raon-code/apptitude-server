/**
 * session-service.js
 *  세션 서비스
 */
const User = require('@/models/user');
const LoginPlatform = require('@/models/login-platform');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');

const {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  isJwtTokenExpired,
  getJwtPayload
} = require('@/config/security/jwt');

const LoginUserDTO = require('@/types/dto/login-user-dto');
const { isEmpty } = require('@/common/validate');
const { sequelize } = require('@/models');

/**
 * 로그인(세션 생성)
 *
 * @param {LoginUserDTO} loginUserDTO
 * @returns {String} 액세스 토큰
 */
async function login(loginUserDTO) {
  const transaction = await sequelize.transaction();

  try {
    // 사용자 정보 조회, 로그인 플랫폼으로부터
    // 로그인 플랫폼 타입, uuid값으로 사용자를 찾음
    const loginPlatformWithUser = await LoginPlatform.findOne({
      where: {
        platformType: loginUserDTO.platformType,
        uuid: loginUserDTO.uuid
      },
      include: [{ model: User, as: 'user', required: true }],
      transaction
    });
    if (isEmpty(loginPlatformWithUser)) {
      logger.error(
        '존재하지 않는 사용자 입니다.\n' +
          `플랫폼: ${loginUserDTO.platformType}, 식별 UUID: ${loginUserDTO.uuid}`
      );
      throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
    }

    const user = loginPlatformWithUser.user;
    if (isEmpty(user)) {
      logger.error('사용자 정보가 존재하지 않습니다.');
      throw new BizError('로그인할 수 없습니다. 다시 확인해주세요.');
    }

    // 로그인하면 재발급 토큰 또한 갱신
    const newRefreshJwt = generateJwtRefreshToken(
      // 데이터베이스 조회를 위한 정보
      { id: user.id }
    );
    user.refreshJwt = newRefreshJwt; // 엑세스 토큰 재발급을 위한 토큰
    user.lastLogin = new Date();

    // 로그인에 따른 사용자 업데이트
    await user.save({ transaction });

    // 엑세스 토큰: API에 접근 가능
    // Sequelize 객체, dataValues: 현재 값
    const accessToken = generateJwtAccessToken({ ...user.dataValues });

    await transaction.commit();
    return accessToken;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// TODO: 재발급
async function reissue(refreshToken) {
  // 리프레시 토큰을 이용해 엑세스 토큰 재발급
  // 리프레시 토큰 유효성 검증
  const jwtPayload = getJwtPayload(refreshToken);
  if (isJwtTokenExpired(jwtPayload.exp)) {
    logger.error('리프레시 토큰 만료');
    // UnauthorizeError(401)일 경우 로그인 화면으로 이동해야 함
    throw new UnauthorizeError('세션이 만료되었습니다. 다시 로그인해주세요.');
  }

  const userId = jwtPayload.id;
  if (isEmpty(userId)) {
    logger.error('토큰에 사용자 정보가 없습니다');
    throw new BizError('토큰 정보가 잘못되었습니다.');
  }

  // 사용자 정보 조회
  const user = await User.findOne({ where: { id: userId } });
  if (isEmpty(user)) {
    logger.error('사용자 정보가 존재하지 않습니다.');
    throw new BizError('사용자 정보가 존재하지 않습니다.');
  }

  const newAccessToken = generateJwtAccessToken({ ...user.dataValues });
  return newAccessToken;
}

// TODO: 로그아웃 --> 클라이언트에서 처리
async function logout() {
  // 토큰 비활성화
}

module.exports = { login, reissue, logout };
