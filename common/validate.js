/**
 * validate.js
 *   값을 검증하기 위한 공통함수
 */

/**
 * null, undefined, 빈문자열, 빈배열, 빈객체인지 검사합니다.
 *
 * @param {*} value
 * @returns
 */
function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (value.constructor === Object && Object.keys(value).length === 0)
  );
}

module.exports = { isEmpty };
