/**
 * 공통코드 리스트
 */
const AGE_RANGE = require('@/enum/age-range');
const GENDER = require('@/enum/gender');
const JOB_TYPE = require('@/enum/job-type');
const MESSAGE_TYPE = require('@/enum/message-type');
const OS_TYPE = require('@/enum/os-type');
const PLATFORM_TYPE = require('@/enum/platform-type');
const QUOTE = require('@/enum/quote');
const RESULT_TYPE = require('@/enum/result-type');
const STATUS_TYPE = require('@/enum/status-type');

const ENUM_LIST = [
  GENDER, // 성별
  AGE_RANGE, // 연령대
  JOB_TYPE, // 직업종류
  PLATFORM_TYPE, // 플랫폼 타입
  OS_TYPE, // 운영체제 타입
  MESSAGE_TYPE, // 메시지 타입
  RESULT_TYPE, // 대결결과 타입
  STATUS_TYPE, //대결상태 타입
  QUOTE // 명언
];

// 객체의 값을 변경하지 못하도록 설정
ENUM_LIST.map((enums) => {
  Object.freeze(enums);
});

module.exports = ENUM_LIST;
