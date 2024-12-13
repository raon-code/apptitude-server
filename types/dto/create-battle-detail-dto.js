/**
 * create-battle-detail-dto.js
 *  대결 생성에 필요한 값들을 담은 DTO
 */
const { STATUS_TYPE } = require('@/enum/status-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  detoxTotalTime: Joi.number().required().messages({
    'number.base': '디톡스 총 시간은 숫자여야 합니다',
    'any.required': '디톡스 총 시간을 입력해주세요'
  }),
  detoxTime: Joi.number().required().messages({
    'number.base': '디톡스 수행시간은 숫자여야 합니다',
    'any.required': '디톡스 수행시간을 입력해주세요'
  }),
  resultType: Joi.string().required().messages({
    'string.base': '결과타입은 문자열이어야 합니다',
    'any.required': '결과타입을 입력해주세요'
  }),
  userId: Joi.number().required().messages({
    'number.base': '대결 생성자 ID는 숫자여야 합니다',
    'any.required': '대결 생성자 ID를 입력해주세요'
  }),
  battleId: Joi.number().required().messages({
    'number.base': '대결 ID는 숫자여야 합니다',
    'any.required': '대결 ID를 입력해주세요'
  })
});

class CreateBattleDetailDTO {
  detoxTotalTime;
  detoxTime;
  resultType;
  statusType = STATUS_TYPE.WAIT.code;
  userId;
  battleId;

  constructor({ detoxTotalTime, detoxTime, resultType, userId, battleId }) {
    this.detoxTotalTime = detoxTotalTime;
    this.detoxTime = detoxTime;
    this.resultType = resultType;
    this.userId = userId;
    this.battleId = battleId;
  }

  static fromPlainObject(obj) {
    return new CreateBattleDetailDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateBattleDetailDTO;
