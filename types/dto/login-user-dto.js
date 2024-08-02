/**
 * login-user-dto.js
 *    사용자 로그인에 필요한 값들을 담은 DTO
 */
const { PLATFORM_TYPE_CODE } = require('@/enum/platform-type');
const { BizError } = require('@/error');
const Joi = require('joi');

/* 파라미터 검증 설정 */
const validateSchema = Joi.object({
  platformType: Joi.string()
    .valid(...Object.values(PLATFORM_TYPE_CODE))
    .required()
    .messages({
      'any.only': '플랫폼 타입은 미리 정의된 값 중 하나여야 합니다',
      'any.required': '플랫폼 타입을 입력해주세요'
    }),
  uuid: Joi.string().required().messages({
    'string.base': 'UUID는 문자열이어야 합니다',
    'any.required': 'UUID를 입력해주세요'
  })
});

class LoginUserDTO {
  platformType; // 공통코드
  uuid;

  constructor({ platformType, uuid }) {
    this.platformType = platformType;
    this.uuid = uuid;
  }

  static fromPlainObject(obj) {
    return new LoginUserDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = LoginUserDTO;
