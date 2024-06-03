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

const passportOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

    // TODO: 올바른 페이로드인지 검증 로직
    const expiration = jwtPayload.exp;
    if (isEmpty(expiration)) {
      return done(new UnauthorizeError('잘못된 토큰 정보'), false);
    }

    if (isExpired(expiration)) {
      // TODO: 토큰 갱신 로직
    }

    // if (jwtPayload.id !== 1) {
    //   return done(null, false);
    // }

    return done(null, jwtPayload);
  })
);

const authMiddleware = (req, res, next) => {
  authHandler.authenticate('jwt', { session: false }, (err, user, info) => {
    // 인증로직에서 에러 발생 또는 권한이 없는 경우
    if (err || !user) {
      // TODO: 에러 로그로 잘못된 접근에 대한 기록이 필요해보임
      response(res, StatusCodes.UNAUTHORIZED, '권한없음');
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

function isExpired(expiration) {
  const now = new Date().getTime() / 1000;
  return now > expiration;
}

module.exports = {
  authMiddleware,
  authHandler
};
