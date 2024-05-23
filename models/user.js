/**
 * user.js
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '사용자식별ID'
    },
    email: {
      type: DataTypes.STRING(350),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: '이메일'
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '닉네임'
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '성별'
    },
    ageRange: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '연령대'
    },
    jobType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '직업타입'
    },
    jobDetail: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '직업상세'
    },
    profilePhotoPath: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '프로필 사진 경로'
    },
    refreshJwt: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: '갱신토큰값'
    },
    withdrawDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '탈퇴날짜'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '마지막 로그인 일자'
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'user', // 테이블 이름
    comment: '사용자 정보', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

syncModel(User);

module.exports = User;
