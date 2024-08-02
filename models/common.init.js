/**
 *  common.init.js
 *    공통코드 값 초기화
 */
const { ENUM_LIST } = require('@/enum');

/**
 * enum으로 정의한 공통코드 데이터를 테이블에 추가합니다.
 * 값이 이미 존재하는 경우 값을 갱신시켜줍니다.
 *
 * @param {Model} Common Common 테이블 클래스
 */
async function initCommonData(Common) {
  ENUM_LIST.forEach(async (enums) => {
    for (const key in enums) {
      await Common.upsert({
        codeValue: enums[key].code,
        description: enums[key].value
      });
    }
  });
}

module.exports = initCommonData;
