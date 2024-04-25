/**
 *  common.init.js
 *    공통코드 값 초기화
 */
const DATA_LIST = [
  // GD: GENDER, 성별
  commonData('GD0', '여자'),
  commonData('GD1', '남자'),
  // AR: AGE_RANGE, 연령대
  commonData('AR0', '10대 이하'),
  commonData('AR1', '20대'),
  commonData('AR2', '30대'),
  commonData('AR3', '40대'),
  commonData('AR4', '50대'),
  commonData('AR5', '60대'),
  commonData('AR6', '70대'),
  commonData('AR7', '80대'),
  commonData('AR8', '90대 이상'),
  // JT: JOB_TYPE, 직업종류
  commonData('JT0', '학생'),
  commonData('JT1', '고시생'),
  commonData('JT2', '취준생'),
  commonData('JT3', '직장인'),
  commonData('JT99', '그 외(직접입력)'),
  // PT: PLATFORM_TYPE, 플랫폼 타입
  commonData('PT0', '카카오'),
  // OST: OS_TYPE, 운영체제 타입
  commonData('OST0', 'Android'),
  commonData('OST1', 'iOS'),
  commonData('OST9', '그 외'),
  // MT: MESSAGE_TYPE, 메시지 타입
  commonData('MT0', '?'),
  // RT: RESULT_TYPE, 대결결과 타입
  commonData('RT0', '패배'),
  commonData('RT1', '승리'),
  commonData('RT2', '무승부'),
  // ST: STATUS_TYPE, 대결상태 타입
  commonData('ST0', '대기'),
  commonData('ST1', '반려'),
  commonData('ST2', '진행'),
  commonData('ST3', '취소'),
  commonData('ST4', '종료'),
  // QT: QUOTE, 명언
  commonData('QT000', '일하지 않는 자, 먹지도 말라\n- 데살로니카 후서')
];

function commonData(codeValue, description) {
  return { codeValue, description };
}

async function initCommonData(Common) {
  DATA_LIST.forEach(async (data) => {
    await Common.upsert(data);
  });
}

module.exports = initCommonData;
