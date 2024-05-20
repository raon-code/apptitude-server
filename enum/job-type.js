const CommonTemplate = require('@/enum/common-template');
const { getEnumMap } = require('@/enum');

/**
 * job-type.js
 *  직업 종류 도메인
 */
const JOB_TYPE = {
  STUDENT: new CommonTemplate('JT0', '학생'),
  EXAMINEE: new CommonTemplate('JT1', '고시생'),
  JOB_SEEKER: new CommonTemplate('JT2', '취준생'),
  WORKER: new CommonTemplate('JT3', '직장인'),
  OTHERS: new CommonTemplate('JT4', '그외(직접입력)')
};

const JOB_TYPE_MAP = getEnumMap(this.JOB_TYPE_MAP);

module.exports = { JOB_TYPE, JOB_TYPE_MAP };
