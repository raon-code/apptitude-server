const CommonTemplate = require('@/enum/common-template');

/**
 * os-type.js
 *  운영체제 타입 도메인
 */
const OS_TYPE = {
  ANDROID: new CommonTemplate('OT0', 'Android'),
  IOS: new CommonTemplate('OT1', 'iOS'),
  OTHERS: new CommonTemplate('OT99', '그 외')
};

module.exports = OS_TYPE;
