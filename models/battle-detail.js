/**
 * battle_detail.js
 *  대결상세 스키마
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');
const Battle = require('@/models/battle');

class BattleDetail extends Model {}

BattleDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // default: not null
      comment: '대결상세 식별 id'
    },
    detoxTotalTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '디톡스 총 시간(분)'
    },
    detoxTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '디톡스 수행시간(분)'
    },
    resultType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '결과타입'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별id',
      references: {
        model: User,
        key: 'id'
      }
    },
    battleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '대결 식별id',
      references: {
        model: Battle,
        key: 'id'
      }
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'battle_detail', // 테이블 이름
    comment: '대결상세', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

// 사용자와 대결상세는 1:N 관계
User.hasMany(BattleDetail, {
  foreignKey: 'userId',
  sourceKey: 'id'
});
BattleDetail.belongsTo(User, {
  foreignKey: 'userId',
  sourceKey: 'id'
});

// 대결과 대결상세는 1:M 관계
Battle.hasMany(BattleDetail, {
  foreignKey: 'battleId',
  sourceKey: 'id'
});
BattleDetail.belongsTo(Battle, {
  foreignKey: 'battleId',
  sourceKey: 'id'
});
syncModel(BattleDetail);

module.exports = BattleDetail;
