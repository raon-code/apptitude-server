/**
 * message-type.js
 *  푸시 메시지 타입 공통코드(?)
 */
const CommonTemplate = require('@/enum/common-template');
const {
  convertToEnumMap,
  convertToEnumCodeList
} = require('@/common/convertor');

const MESSAGE_TYPE = {
  UNKNOWN: new CommonTemplate('MT0', '?')
};

const MESSAGE_TYPE_MAP = convertToEnumMap(MESSAGE_TYPE);
const MESSAGE_TYPE_CODE = convertToEnumCodeList(MESSAGE_TYPE);

module.exports = { MESSAGE_TYPE, MESSAGE_TYPE_MAP, MESSAGE_TYPE_CODE };
