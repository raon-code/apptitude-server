const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

/**
 * gender.js
 *  성별 도메인
 */
const GENDER = {
  FEMALE: new CommonTemplate('GD0', '여자'),
  MALE: new CommonTemplate('GD1', '남자')
};

const GENDER_MAP = convertToEnumMap(GENDER);
const GENDER_CODE = convertToEnumCodeList(GENDER);

module.exports = { GENDER, GENDER_MAP, GENDER_CODE };
