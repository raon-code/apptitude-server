const CommonTemplate = require('@/enum/common-template');
const { getEnumMap } = require('@/enum');

/**
 * age-range.js
 *  연령대 도메인
 */
const AGE_RANGE = {
  AGE_UNDER_10: new CommonTemplate('AR0', '10대 이하'),
  AGE_20: new CommonTemplate('AR1', '20대'),
  AGE_30: new CommonTemplate('AR2', '30대'),
  AGE_40: new CommonTemplate('AR3', '40대'),
  AGE_50: new CommonTemplate('AR4', '50대'),
  AGE_60: new CommonTemplate('AR5', '60대'),
  AGE_70: new CommonTemplate('AR6', '70대'),
  AGE_80: new CommonTemplate('AR7', '80대'),
  AGE_OVER_90: new CommonTemplate('AR8', '90대 이상')
};

const AGE_RANGE_MAP = getEnumMap(AGE_RANGE);

module.exports = { AGE_RANGE, AGE_RANGE_MAP };
