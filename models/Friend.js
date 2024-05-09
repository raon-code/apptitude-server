/**
 * Friend.js
 */
const { Model, DataTypes } = require('sequelize');
//const { sequelize, syncModel } = require('@/models');
const User = require('./User');

class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '친구식별ID'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별ID',
      references: {
        model: User,
        key: 'id'
      }
    },
    friend_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '친구 사용자 식별ID',
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'Friend', // 테이블 이름
    comment: '친구 정보', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

syncModel(Friend);

module.exports = Friend;
