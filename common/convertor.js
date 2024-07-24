/**
 * convertor.js
 *  각종 변환 공통함수
 */
const logger = require('@/config/logger');

/**
 * Enum -> Map(code, element)
 * (code값을 통해 enum을 찾기 위한 map)
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
 * Enum -> EnumCodeList
 * (EnumCodeList: validation을 위한 enum code list)
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
