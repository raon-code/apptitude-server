/**
 * auth-handler.js
 *  인증, 인가, 세션관리 등을 담당하는 미들웨어
 */
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const logger = require('@/config/logger');

// TODO: 세션관리, JWT 설정
function initializeSessionManager() {
  passport.use(new JWTStrategy({}, (payload, next) => {}));
}

// TODO: 로그인 정책설정
function authenticate() {}

module.exports = {
  initializeSessionManager,
  authenticate
};
