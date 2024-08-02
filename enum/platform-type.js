/**
 * platform-type.js
 *  로그인 플랫폼 타입 공통코드
 */
const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

const PLATFORM_TYPE = {
  KAKAO: new CommonTemplate('PT0', '카카오')
};

const PLATFORM_TYPE_MAP = convertToEnumMap(PLATFORM_TYPE);
const PLATFORM_TYPE_CODE = convertToEnumCodeList(PLATFORM_TYPE);

module.exports = { PLATFORM_TYPE, PLATFORM_TYPE_MAP, PLATFORM_TYPE_CODE };
