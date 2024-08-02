/**
 * object-util.js
 * 
 * js object 관련 공통함수
 * 
 */
const { isEmpty } = require('@/common/validate');

/**
 * object의 properties를 업데이트
 * object의 key에 해당하는 값이 updateParams에 존재하면 해당값으로 업데이트
 * 
 * @param {object} object 
 * @param {object} updateParams
 */
function updateProperties(object, updateParams) {
  for (let key in updateParams) {
    if (!isEmpty(updateParams[key])) {
      object[key] = updateParams[key];
    }
  }
}

module.exports = {
  updateProperties
};
