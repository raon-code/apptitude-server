const CommonTemplate = require('@/enum/common-template');
const { getEnumMap } = require('@/enum');

/**
 * message-type.js
 *  메시지 타입 도메인
 */
const MESSAGE_TYPE = {
  UNKNOWN: new CommonTemplate('MT0', '?')
};

const MESSAGE_TYPE_MAP = getEnumMap(MESSAGE_TYPE);

module.exports = { MESSAGE_TYPE, MESSAGE_TYPE_MAP };
