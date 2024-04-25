/**
 * test.js
 *  작동 테스트용 스키마
 */
const { Model, DataTypes } = require('sequelize');

const { sequelize, syncModel } = require('@/models');

class Test extends Model {}

Test.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      comment: '아이디'
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '일시'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '제목'
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '내용'
    }
  },
  {
    sequelize, // 인스턴스 전달
    modelName: 'test', // 모델 이름 지정
    comment: '테스트', // 테이블에 대한 설명
    underscored: false, // 스네이크케이스 자동변환
    timestamps: false // createdAt, updatedAt 컬럼을 자동으로 추가하지 않음
  }
);

// sequelize와 동기화
syncModel(Test);

module.exports = Test;
