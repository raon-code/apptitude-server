/**
 * auth-handler.js
 *  인증, 인가, 세션관리 등을 담당하는 미들웨어
 */
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const logger = require('@/config/logger');
const config = require('@/config');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizeError } = require('@/error');
const response = require('@/common/response');
const { isEmpty } = require('@/common/validate');
const {
  getJwtPayload,
  setJwtTokenCookie,
  getJwtTokenCookie
} = require('@/config/security/jwt');
const { reissue } = require('@/services/session-service');

const passportOption = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    getJwtTokenCookie, // 쿠키 토큰 사용
    ExtractJwt.fromAuthHeaderAsBearerToken() // 헤더 토큰 사용
  ]),
  secretOrKey: config.jwt.secret,
  algorithms: config.jwt.algorithm
};

const authHandler = passport.use(
  new JWTStrategy(passportOption, async (jwtPayload, done) => {
    /* 
      jwtPayload는 시크릿키 검증이 완료된 후의 payload이며,
      여기서 사용자의 추가적인 인증 로직을 구현할 수 있습니다.
      (토큰 유효기간 검증 및 갱신, 권한 검증 등)
      예를 들어, jwt_payload의 사용자 정보를 바탕으로 데이터베이스를 조회할 수 있습니다.
    */
    return done(null, jwtPayload);
  })
);

const authMiddleware = (req, res, next) => {
  authHandler.authenticate(
    'jwt',
    { session: false },
    async (err, user, info) => {
      try {
        // 토큰 만료 시 재발급
        if (info && info.name === 'TokenExpiredError') {
          const accessToken = req.headers['authorization'].split(' ')[1];
          const payload = getJwtPayload(accessToken);

          if (payload) {
            const newAccessToken = await reissue(payload.refreshJwt);
            setJwtTokenCookie(res, newAccessToken);
            req.user = getJwtPayload(newAccessToken);
            next();
            return;
          }
        }

        // 검증 실패
        if (err || !user) {
          throw new UnauthorizeError('권한이 없습니다.');
        }
      } catch (error) {
        logger.error(error);
        response(res, StatusCodes.UNAUTHORIZED, '권한없음');
        return;
      }

      // 인증 성공
      req.user = user;
      next();
    }
  )(req, res, next);
};

module.exports = {
  authMiddleware,
  authHandler
};
