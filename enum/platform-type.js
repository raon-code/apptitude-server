const CommonTemplate = require('@/enum/common-template');
const { getEnumMap } = require('@/enum');

/**
 * platform-type.js
 *  로그인 플랫폼 타입 도메인
 */
const PLATFORM_TYPE = {
  KAKAO: new CommonTemplate('PT0', '카카오')
};

const PLATFORM_TYPE_MAP = getEnumMap(PLATFORM_TYPE);

module.exports = { PLATFORM_TYPE, PLATFORM_TYPE_MAP };
