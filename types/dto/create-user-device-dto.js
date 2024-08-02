/**
 * create-user-device-dto.js
 *   사용자 기기 생성에 필요한 값들을 담은 DTO
 */

const { BizError } = require('@/error');
const Joi = require('joi');

const { OS_TYPE_CODE } = require('@/enum/os-type');

const validateSchema = Joi.object({
  uuid: Joi.string().messages({
    'string.base': '기기식별값은 문자열이어야 합니다',
    'any.required': '기기식별값을 입력해주세요'
  }),
  osType: Joi.string()
    .valid(...Object.values(OS_TYPE_CODE))
    .messages({
      'string.base': '운영체제 유형은 미리 정의된 값 중 하나여야 합니다',
      'any.required': '운영체제 유형을 입력해주세요'
    }),
  osVersion: Joi.string().messages({
    'string.base': '운영체제 버전은 문자열이어야 합니다',
    'any.required': '운영체제 버전을 입력해주세요'
  }),
  isUsing: Joi.boolean().messages({
    'boolean.base': '사용여부는 불리언이어야 합니다',
    'any.required': '사용여부를 입력해주세요'
  }),
  userId: Joi.number().required().messages({
    'number.base': '사용자 식별ID는 숫자여야 합니다',
    'any.required': '사용자 식별ID를 입력해주세요'
  })
});

class CreateUserDeviceDTO {
  uuid;
  osType;
  osVersion;
  isUsing;
  userId;

  constructor({ uuid, osType, osVersion, isUsing, userId }) {
    this.uuid = uuid;
    this.osType = osType;
    this.osVersion = osVersion;
    this.isUsing = isUsing;
    this.userId = userId;
  }

  static fromPlainObject(obj) {
    return new CreateUserDeviceDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateUserDeviceDTO;
