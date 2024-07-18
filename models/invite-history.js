/**
 * invite_history.js
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const Battle = require('@/models/battle');

class InviteHistory extends Model {}

InviteHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '초대내역 식별ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별ID'
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '초대대상 식별ID'
    },
    inviteLink: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '초대링크'
    },
    inviteDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '초대일자'
    },
    battleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '대결 식별ID',
      references: {
        model: Battle,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'invite_history', // 테이블 이름
    comment: '사용자 정보', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

syncModel(InviteHistory);

module.exports = InviteHistory;
