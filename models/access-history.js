/**
 * access_history.js
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');

class AccessHistory extends Model {}

AccessHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '접속내역 식별ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '사용자 식별ID',
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'access_history', // 테이블 이름
    comment: '접속내역', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

syncModel(AccessHistory);

module.exports = AccessHistory;
