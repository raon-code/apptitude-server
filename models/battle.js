/**
 * battle.js
 *  대결 스키마
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');

class Battle extends Model {}

Battle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // default: not null
      comment: '대결 식별 id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '대결명'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '시작일'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '종료일'
    },
    inviteLink: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '초대링크'
    },
    validWaitTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '대기유효시간(분)'
    },
    reward: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '보상'
    },
    isRewardPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: '보상여부'
    },
    statusType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '상태타입'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별id',
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'battle', // 테이블 이름
    comment: '대결', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

// 사용자와 대결은 1:N 관계
User.hasMany(Battle, {
  as: 'battle',
  foreignKey: 'userId',
  sourceKey: 'id'
});
Battle.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
  sourceKey: 'id'
});

syncModel(Battle);

module.exports = Battle;
