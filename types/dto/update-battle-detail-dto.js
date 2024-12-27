/**
 * update-battle-detail-dto.js
 *  대결 업데이트에 필요한 값들을 담은 DTO
 */
const { RESULT_TYPE } = require('@/enum/result-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({});

class UpdateBattleDetailDTO {
  constructor({}) {}

  static fromPlainObject(obj) {
    return new UpdateBattleDetailDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = UpdateBattleDetailDTO;
