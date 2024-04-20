/**
 * auth-handler.js
 *  인증, 인가, 세션관리 등을 담당하는 미들웨어
 */
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const logger = require('@/config/logger');
const config = require('@/config');

const passportOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
};

const authHandler = passport.use(
  new JWTStrategy(passportOption, (jwt_payload, done) => {
    // 인증로직
    return done(null, true);
  })
);

module.exports = authHandler;
