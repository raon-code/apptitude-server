/**
 * common-template.js
 *  공통코드 객체 템플릿
 * 
 *  1. code: 코드 값(OT0)
 *  2. value: 실제 명(Android) 
 *  3. other: 기타 정보({ otherInfo1: '기타 정보1', otherInfo2: '기타 정보2' })
 */
class CommonTemplate {
  constructor(code, value, other) {
    this.code = code;
    this.value = value;
    this.other = other;
  }
}

module.exports = CommonTemplate;
