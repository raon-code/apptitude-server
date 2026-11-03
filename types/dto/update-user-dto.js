/**
 * update-user-dto.js
 *  사용자 정보 업데이트에 필요한 값들을 담은 DTO
 */
const { AGE_RANGE_CODE } = require('@/enum/age-range');
const { GENDER_CODE } = require('@/enum/gender');
const { JOB_TYPE_CODE } = require('@/enum/job-type');
const { PLATFORM_TYPE_CODE } = require('@/enum/platform-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
});

class UpdateUserDTO {
  constructor() {
  }

  static fromPlainObject(obj) {
    return new UpdateUserDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = UpdateUserDTO;
