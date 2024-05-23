/**
 * 공통코드 리스트
 */
const {
  AGE_RANGE,
  AGE_RANGE_MAP,
  AGE_RANGE_CODE
} = require('@/enum/age-range');
const { GENDER, GENDER_MAP, GENDER_CODE } = require('@/enum/gender');
const { JOB_TYPE, JOB_TYPE_MAP, JOB_TYPE_CODE } = require('@/enum/job-type');
const {
  MESSAGE_TYPE,
  MESSAGE_TYPE_MAP,
  MESSAGE_TYPE_CODE
} = require('@/enum/message-type');
const { OS_TYPE, OS_TYPE_MAP, OS_TYPE_CODE } = require('@/enum/os-type');
const {
  PLATFORM_TYPE,
  PLATFORM_TYPE_MAP,
  PLATFORM_TYPE_CODE
} = require('@/enum/platform-type');
const { QUOTE, QUOTE_MAP, QUOTE_CODE } = require('@/enum/quote');
const {
  RESULT_TYPE,
  RESULT_TYPE_MAP,
  RESULT_TYPE_CODE
} = require('@/enum/result-type');
const {
  STATUS_TYPE,
  STATUS_TYPE_MAP,
  STATUS_TYPE_CODE
} = require('@/enum/status-type');

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

const ENUM_MAP_LIST = [
  GENDER_MAP, // 성별
  AGE_RANGE_MAP, // 연령대
  JOB_TYPE_MAP, // 직업종류
  PLATFORM_TYPE_MAP, // 플랫폼 타입
  OS_TYPE_MAP, // 운영체제 타입
  MESSAGE_TYPE_MAP, // 메시지 타입
  RESULT_TYPE_MAP, // 대결결과 타입
  STATUS_TYPE_MAP, //대결상태 타입
  QUOTE_MAP // 명언
];

const ENUM_CODE_LIST = [
  GENDER_CODE, // 성별
  AGE_RANGE_CODE, // 연령대
  JOB_TYPE_CODE, // 직업종류
  PLATFORM_TYPE_CODE, // 플랫폼 타입
  OS_TYPE_CODE, // 운영체제 타입
  MESSAGE_TYPE_CODE, // 메시지 타입
  RESULT_TYPE_CODE, // 대결결과 타입
  STATUS_TYPE_CODE, //대결상태 타입
  QUOTE_CODE // 명언
];

// 객체의 값을 변경하지 못하도록 설정
ENUM_LIST.map((_enum) => {
  Object.freeze(_enum);
});

// 객체의 값을 변경하지 못하도록 설정
ENUM_MAP_LIST.map((enumMap) => {
  Object.freeze(enumMap);
});

// 객체의 값을 변경하지 못하도록 설정
ENUM_MAP_CODE.map((enumCode) => {
  Object.freeze(enumCode);
});

module.exports = {
  ENUM_LIST,
  ENUM_MAP_LIST,
  ENUM_CODE_LIST
};
