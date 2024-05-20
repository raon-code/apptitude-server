const CommonTemplate = require('@/enum/common-template');
const { getEnumMap } = require('@/enum');

/**
 * os-type.js
 *  운영체제 타입 도메인
 */
const OS_TYPE = {
  ANDROID: new CommonTemplate('OT0', 'Android'),
  IOS: new CommonTemplate('OT1', 'iOS'),
  OTHERS: new CommonTemplate('OT99', '그 외')
};

const OS_TYPE_MAP = getEnumMap(OS_TYPE);

module.exports = { OS_TYPE, OS_TYPE_MAP };
