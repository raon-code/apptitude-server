/**
 *  common.init.js
 *    공통코드 값 초기화
 */
const { ENUM_LIST } = require('@/enum');

/**
 * common 테이블에 명세한 데이터리스트를 추가합니다.
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
