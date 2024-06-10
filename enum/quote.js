const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

/**
 * quote.js
 *  명언 모은
 */
const QUOTE = {
  QT000: new CommonTemplate(
    'QT000',
    '일하지 않는 자, 먹지도 말라\n- 데살로니카 후서'
  )
};

const QUOTE_MAP = convertToEnumMap(QUOTE);
const QUOTE_CODE = convertToEnumCodeList(QUOTE);

module.exports = { QUOTE, QUOTE_MAP, QUOTE_CODE };
