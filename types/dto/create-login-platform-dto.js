/**
 * create-user-dto.js
 */
const { PLATFORM_TYPE_CODE } = require('@/enum/platform-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  platformType: Joi.string()
    .valid(...Object.values(PLATFORM_TYPE_CODE))
    .required()
    .messages({
      'string.base': '플랫폼 유형은 미리 정의된 값 중 하나여야 합니다',
      'any.required': '플랫폼 유형을 입력해주세요'
    }),
  uuid: Joi.string().required().messages({
    'string.base': 'UUID는 문자열이어야 합니다',
    'any.required': 'UUID를 입력해주세요'
  }),
  userId: Joi.number().required().messages({
    'string.base': '사용자 ID는 숫자이어야 합니다',
    'any.required': '사용자 ID를 입력해주세요'
  })
});

class CreateLoginPlatformDTO {
  platformType;
  uuid;
  userId;

  constructor({ platformType, uuid, userId }) {
    this.platformType = platformType;
    this.uuid = uuid;
    this.userId = userId;
  }

  static fromPlainObject(obj) {
    return new CreateLoginPlatformDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateLoginPlatformDTO;
