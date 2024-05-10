const CommonTemplate = require('@/enum/common-template');

/**
 * result-type.js
 *  대결 결과 타입
 */
const RESULT_TYPE = {
  DEFEAT: new CommonTemplate('RT0', '패배'),
  WIN: new CommonTemplate('RT1', '승리'),
  DRAW: new CommonTemplate('RT2', '무승부')
};

module.exports = RESULT_TYPE;
