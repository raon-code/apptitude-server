/**
 * login-platform-service.js
 *  로그인플랫폼 관련 서비스
 */
const LoginPlatform = require('@/models/login-platform');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createLoginPlatform() {}

module.exports = {
  createLoginPlatform
};
