/**
 * quote.js
 *  명언 공통코드
 */
const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

const QUOTE = {
  QT000: new CommonTemplate(
    'QT000',
    '일하지 않는 자, 먹지도 말라\n- 데살로니카 후서(2 Thessalonians) 3:10'
  ),
  QT001: new CommonTemplate(
    'QT001',
    '쓸모 없는 것이 되려 쓸모 있어진다.(無用之用, 무용지용) \n- 장자(莊子)'
  ),
  QT002: new CommonTemplate('QT002', '행복은 무엇인가? \n- 노자(老子)'),
  QT003: new CommonTemplate(
    'QT003',
    '캐묻지 않는 삶은 살 가치가 없다. \n- 소크라테스(Socrates)'
  )
};

const QUOTE_MAP = convertToEnumMap(QUOTE);
const QUOTE_CODE = convertToEnumCodeList(QUOTE);

module.exports = { QUOTE, QUOTE_MAP, QUOTE_CODE };
