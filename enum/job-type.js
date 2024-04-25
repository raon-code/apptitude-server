const JOB_TYPE = {
  STUDENT: { common: { codeValue: 'JT0', description: '학생' } },
  EXAMINEE: { common: { codeValue: 'JT1', description: '고시생' } },
  JOB_SEEKER: { common: { codeValue: 'JT2', description: '취준생' } },
  WORKER: { common: { codeValue: 'JT3', description: '직장인' } },
  OTHERS: { common: { codeValue: 'JT99', description: '그외(직접입력)' } }
};

module.exports = JOB_TYPE;
