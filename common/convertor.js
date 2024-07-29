/**
 * convertor.js
 *  각종 변환 공통함수
 */

/**
 * Enum(key, element{code,value,other}) -> Enum(key(code), element{code,value,other})
 * (code값을 통해 enum을 찾기 위한 map)
 *
 * @param {*} _enum
 * @returns
 */
function convertToEnumMap(_enum) {
  const result = {};
  Object.values(_enum).forEach((element) => {
    result[element.code] = element;
  });
  return result;
}

/**
 * Enum -> EnumCode
 * (EnumCodeList: validation을 위한 enum code list)
 *
 * @param {*} _enum
 * @returns
 */
function convertToEnumCodeList(_enum) {
  const enumCode = {};
  Object.keys(_enum).forEach((key) => {
    enumCode[key] = _enum[key].code;
  });
  return enumCode;
}

module.exports = {
  convertToEnumMap,
  convertToEnumCodeList
};
