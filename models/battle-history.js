/**
 * battle_history.js
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');
const Battle = require('@/models/battle');

class BattleHistory extends Model {}

BattleHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '대결식별 ID'
    },
    detoxTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '디톡스 수행시간(분)'
    },
    battleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '대결 날짜'
    },
    battleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '대결 식별ID',
      references: {
        model: Battle,
        key: 'id'
      }
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
    sequelize,
    modelName: 'battle_history', // 테이블 이름
    comment: '대결 히스토리', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createdAt, updatedAt 필드 추가 및 자동관리
  }
);

syncModel(BattleHistory);

module.exports = BattleHistory;
