class CreateUserDTO {
  constructor({
    email,
    nickname,
    gender,
    ageRange,
    jobType,
    jobDetail,
    profilePhotoPath
  }) {
    this.email = email;
    this.nickname = nickname;
    this.gender = gender;
    this.ageRange = ageRange;
    this.jobType = jobType;
    this.jobDetail = jobDetail;
    this.profilePhotoPath = profilePhotoPath;
  }

  validate() {
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!this.nickname) {
      throw new Error('Nickname is required');
    }
    if (!this.gender) {
      throw new Error('Gender is required');
    }
    if (!this.ageRange) {
      throw new Error('Age range is required');
    }
    if (!this.jobType) {
      throw new Error('Job type is required');
    }
    if (!this.jobDetail) {
      throw new Error('Job detail is required');
    }
    if (!this.profilePhotoPath) {
      throw new Error('Profile photo path is required');
    }
  }

  toObject() {
    return {
      email: this.email,
      nickname: this.nickname,
      gender: this.gender,
      ageRange: this.ageRange,
      jobType: this.jobType,
      jobDetail: this.jobDetail,
      profilePhotoPath: this.profilePhotoPath
    };
  }
}

module.exports = CreateUserDTO;
