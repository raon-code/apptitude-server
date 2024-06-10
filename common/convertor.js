/**
 * convertor.js
 *  각종 변환 공통함수
 */
const logger = require('@/config/logger');

/**
 *
 * @param {*} _enum
 * @returns
 */
function convertToEnumMap(_enum) {
  const enumMap = new Map();
  Object.values(_enum).forEach((element) => {
    enumMap.set(element.code, element);
  });
  return enumMap;
}

/**
 *
 * @param {*} _enum
 * @returns
 */
function convertToEnumCodeList(_enum) {
  const enumCodeList = new Map();
  Object.values(_enum).forEach((element) => {
    enumCodeList.set(element.code, element.code);
  });
  return enumCodeList;
}

module.exports = {
  convertToEnumMap,
  convertToEnumCodeList
};
