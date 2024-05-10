const CommonTemplate = require('@/enum/common-template');

/**
 * gender.js
 *  성별 도메인
 */
const GENDER = {
  FEMALE: new CommonTemplate('GD0', '여자'),
  MALE: new CommonTemplate('GD1', '남자')
};

module.exports = GENDER;
