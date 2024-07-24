/**
 * create-battle-dto.js
 */
const { STATUS_TYPE } = require('@/enum/status-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '대결 이름은 문자열이어야 합니다',
    'any.required': '대결 이름을 입력해주세요'
  }),
  startDate: Joi.date().required().messages({
    'date.base': '시작일은 날짜여야 합니다',
    'any.required': '시작일을 입력해주세요'
  }),
  endDate: Joi.date().required().messages({
    'date.base': '종료일은 날짜여야 합니다',
    'any.required': '종료일을 입력해주세요'
  }),
  reward: Joi.string().required().messages({
    'string.base': '보상은 문자열이어야 합니다',
    'any.required': '보상을 입력해주세요'
  }),
  userId: Joi.number().required().messages({
    'number.base': '대결 생성자 ID는 숫자여야 합니다',
    'any.required': '대결 생성자 ID를 입력해주세요'
  })
});

class CreateBattleDTO {
  name;
  startDate;
  endDate;
  reward;
  isRewardPaid = false;
  statusType = STATUS_TYPE.WAIT.code;
  userId;

  constructor({ name, startDate, endDate, reward, userId }) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reward = reward;
    this.userId = userId;
  }

  static fromPlainObject(obj) {
    return new CreateBattleDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateBattleDTO;
