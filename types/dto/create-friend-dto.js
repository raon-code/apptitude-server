/**
 * create-friend-dto.js
 *  친구 생성에 필요한 값들을 담은 DTO
 */
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  userId: Joi.number().required().messages({
    'string.base': '사용자 ID는 숫자이어야 합니다',
    'any.required': '사용자 ID를 입력해주세요'
  }),

  friendId: Joi.number().required().messages({
    'string.base': '친구 ID는 숫자이어야 합니다',
    'any.required': '친구 ID를 입력해주세요'
  })
});

class CreateFriendDTO {
  userId;
  friendId;

  constructor({ userId, friendId }) {
    this.userId = userId;
    this.friendId = friendId;
  }

  static fromPlainObject(obj) {
    return new CreateFriendDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateFriendDTO;
