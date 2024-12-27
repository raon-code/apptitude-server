/**
 * create-battle-history-dto.js
 *  대결내역 생성에 필요한 값들을 담은 DTO
 */
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  detoxTime: Joi.number().required().messages({
    'number.base': '디톡스 시간은 숫자여야 합니다',
    'any.required': '디톡스 시간을 입력해주세요'
  }),
  battleDate: Joi.date().required().messages({
    'date.base': '대결 날짜는 날짜여야 합니다',
    'any.required': '대결 날짜를 입력해주세요'
  }),
  battleId: Joi.number().required().messages({
    'number.base': '대결 ID는 숫자여야 합니다',
    'any.required': '대결 ID를 입력'
  }),
  userId: Joi.number().required().messages({
    'number.base': '대결 사용자 ID는 숫자여야 합니다',
    'any.required': '대결 사용자 ID를 입력해주세요'
  })
});

class CreateBattleHistoryDTO {
  detoxTime;
  battleDate;
  battleId;
  userId;

  constructor({ detoxTime, battleDate, battleId, userId }) {
    this.detoxTime = detoxTime;
    this.battleDate = battleDate;
    this.battleId = battleId;
    this.userId = userId;
  }

  static fromPlainObject(obj) {
    return new CreateBattleHistoryDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateBattleHistoryDTO;
