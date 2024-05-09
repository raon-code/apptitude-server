/**
 * Battle_history.js
 */
const { Model, DataTypes } = require('sequelize');

//const { sequelize, syncModel } = require('@/models');

class Battle_history extends Model {}

const Battle_history = sequelize.define(
  'Battle_history',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '대결식별 ID'
    },
    detox_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '디톡스 수행시간(분)'
    },
    battle_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '대결 날짜'
    },
    battle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '대결 식별ID'
      // references: {
      //   model: Battle,
      //   key: 'id'
      // }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '사용자 식별ID'
      // references: {
      //   model: Battle,
      //   key: 'id'
      // }
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

//syncModel(Battle_history);
module.exports = Battle_history;
