/**
 * User_device.js
 */
const { Model, DataTypes } = require('sequelize');
//const { sequelize, syncModel } = require('@/models');
const User = require('./User');

class User_device extends Model {}

User_device.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '사용자기기정보 식별ID'
    },
    uuid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '기기식별값'
    },

    os_type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '운영체제타입'
    },

    os_version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '운영체제버전'
    },

    is_using: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '사용여부'
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별ID',
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

//syncModel(User_device);

module.exports = User_device;