/**
 * friend.js
 *   친구 스키마
 */
const { Model, DataTypes } = require('sequelize');
const { sequelize, syncModel } = require('@/models');

const User = require('@/models/user');

class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '친구식별ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 식별ID',
      references: {
        model: User,
        key: 'id'
      }
    },
    friendId: {
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
    modelName: 'friend', // 테이블 이름
    comment: '친구 정보', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

// 사용자와 친구는 1:N 관계(사용자)
User.hasMany(Friend, {
  as: 'userFriends',
  foreignKey: 'userId',
  sourceKey: 'id'
});
Friend.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
  sourceKey: 'id'
});

// 사용자와 친구는 1:N 관계(친구 사용자)
User.hasMany(Friend, {
  as: 'userFriendOf',
  foreignKey: 'friendId',
  sourceKey: 'id'
});
Friend.belongsTo(User, {
  as: 'friend',
  foreignKey: 'friendId',
  sourceKey: 'id'
});

syncModel(Friend);

module.exports = Friend;
