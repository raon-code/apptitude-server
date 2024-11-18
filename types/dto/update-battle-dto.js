/**  
 * update-battle-dto.js
 *  대결 정보 업데이트에 필요한 값들을 담은 DTO 
 */
const { STATUS_TYPE } = require('@/enum/status-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
});

class UpdateBattleDTO {
  constructor({}) {
  }

  static fromPlainObject(obj) {
    return new UpdateBattleDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = UpdateBattleDTO;