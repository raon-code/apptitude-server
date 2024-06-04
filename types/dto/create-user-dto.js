/**
 * create-user-dto.js
 */
const { AGE_RANGE_CODE } = require('@/enum/age-range');
const { GENDER_CODE } = require('@/enum/gender');
const { JOB_TYPE_CODE } = require('@/enum/job-type');
const { PLATFORM_TYPE_CODE } = require('@/enum/platform-type');
const { BizError } = require('@/error');
const Joi = require('joi');

const validateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '이메일 형식이 잘못되었습니다',
    'any.required': '이메일을 입력해주세요'
  }),
  nickname: Joi.string().required().messages({
    'string.base': '닉네임은 문자열이어야 합니다',
    'any.required': '닉네임을 입력해주세요'
  }),
  gender: Joi.string()
    .valid(...Object.values(GENDER_CODE))
    .required()
    .messages({
      'any.only': '성별은 미리 정의된 값 중 하나여야 합니다',
      'any.required': '성별을 입력해주세요'
    }),
  ageRange: Joi.string()
    .valid(...Object.values(AGE_RANGE_CODE))
    .required()
    .messages({
      'any.only': '연령대는 미리 정의된 값 중 하나여야 합니다',
      'any.required': '연령대를 입력해주세요'
    }),
  jobType: Joi.string()
    .valid(...Object.values(JOB_TYPE_CODE))
    .required()
    .messages({
      'any.only': '직업 유형은 미리 정의된 값 중 하나여야 합니다',
      'any.required': '직업 유형을 입력해주세요'
    }),
  jobDetail: Joi.string().optional().messages({
    'string.base': '직업 상세는 문자열이어야 합니다'
  }),
  profilePhotoPath: Joi.string().optional().messages({
    'string.base': '프로필 사진 경로는 문자열이어야 합니다'
  }),
  LoginPlatform: Joi.object({
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
    })
  })
});

class CreateUserDTO {
  email;
  nickname;
  gender; // 공통코드
  ageRange; // 공통코드
  jobType; // 공통코드
  jobDetail;
  profilePhotoPath;

  // 로그인 플랫폼 정보
  LoginPlatform;
  // {
  //   platformType; // 공통코드
  //   uuid;
  // }

  constructor({
    email,
    nickname,
    gender,
    ageRange,
    jobType,
    jobDetail,
    profilePhotoPath,
    LoginPlatform = { platformType: '', uuid: '' } // 필수
  }) {
    this.email = email;
    this.nickname = nickname;
    this.gender = gender;
    this.ageRange = ageRange;
    this.jobType = jobType;
    this.jobDetail = jobDetail;
    this.profilePhotoPath = profilePhotoPath;
    this.LoginPlatform = LoginPlatform;
  }

  static fromPlainObject(obj) {
    return new CreateUserDTO(obj);
  }

  validate() {
    const { error } = validateSchema.validate(this, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BizError(errorMessages.join(', '));
    }
  }
}

module.exports = CreateUserDTO;
