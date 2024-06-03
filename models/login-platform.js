/**
 * login_platform.js
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');

class LoginPlatform extends Model {}

LoginPlatform.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '로그인플랫폼 식별ID'
    },

    platformType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '플랫폼타입'
    },

    uuid: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '플랫폼식별ID'
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '사용자 식별id',
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'login_platform', // 테이블 이름
    comment: '로그인 정보', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

// 사용자와 로그인플랫폼은 1:1 관계
User.hasOne(LoginPlatform, { foreignKey: 'userId', sourceKey: 'id' });
LoginPlatform.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

syncModel(LoginPlatform);

module.exports = LoginPlatform;
