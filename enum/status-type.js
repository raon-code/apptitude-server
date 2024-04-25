const STATUS_TYPE = {
  WAIT: { common: { codeValue: 'ST0', description: '대기' } },
  REJECT: { common: { codeValue: 'ST1', description: '반려' } },
  PROCEED: { common: { codeValue: 'ST2', description: '진행' } },
  CANCEL: { common: { codeValue: 'ST3', description: '취소' } },
  END: { common: { codeValue: 'ST4', description: '종료' } }
};

module.exports = STATUS_TYPE;
