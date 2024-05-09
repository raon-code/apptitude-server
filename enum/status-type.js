const CommonTemplate = require('@/enum/common-template');

/**
 * status-type.js
 *  대결 상태 타입
 */
const STATUS_TYPE = {
  WAIT: new CommonTemplate('ST0', '대기'),
  REJECT: new CommonTemplate('ST1', '반려'),
  PROCEED: new CommonTemplate('ST2', '진행'),
  CANCEL: new CommonTemplate('ST3', '취소'),
  END: new CommonTemplate('ST4', '종료')
};

module.exports = STATUS_TYPE;
