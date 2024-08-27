/**
 * convertor.js
 *  각종 변환 공통함수
 */

/**
 * code 값을 통해 enum을 찾기 위한 map 생성
 * 
 *
 * @param {enum} _enum Enum(key, element{code,value,other})
 * @returns Enum(key(code), element{code,value,other})
 */
function convertToEnumMap(_enum) {
  const result = {};
  Object.values(_enum).forEach((element) => {
    result[element.code] = element;
  });
  return result;
}

/**
 * validation을 위한 enum code list
 * 
 * 
 * @param {enum} _enum Enum(key, element{code,value,other})
 * @returns Enum(key(code), value(code))
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
