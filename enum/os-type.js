/**
 * os-type.js
 *  운영체제 타입 공통코드
 */
const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

const OS_TYPE = {
  ANDROID: new CommonTemplate('OT0', 'Android'),
  IOS: new CommonTemplate('OT1', 'iOS'),
  OTHERS: new CommonTemplate('OT99', '그 외')
};

const OS_TYPE_MAP = convertToEnumMap(OS_TYPE);
const OS_TYPE_CODE = convertToEnumCodeList(OS_TYPE);

module.exports = { OS_TYPE, OS_TYPE_MAP, OS_TYPE_CODE };
