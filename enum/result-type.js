/**
 * result-type.js
 *  대결 결과타입 공통코드
 */
const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

const RESULT_TYPE = {
  DEFEAT: new CommonTemplate('RT0', '패배'),
  WIN: new CommonTemplate('RT1', '승리'),
  DRAW: new CommonTemplate('RT2', '무승부'),
  PROCEED: new CommonTemplate('RT3', '진행중'),
  SURRENDER: new CommonTemplate('RT4', '포기'),
  CANCEL: new CommonTemplate('RT5', '취소')
};

const RESULT_TYPE_MAP = convertToEnumMap(RESULT_TYPE);
const RESULT_TYPE_CODE = convertToEnumCodeList(RESULT_TYPE);

module.exports = { RESULT_TYPE, RESULT_TYPE_MAP, RESULT_TYPE_CODE };
