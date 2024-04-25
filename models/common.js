/**
 * common.js
 *  공통코드 스키마
 */
const { Model, DataTypes } = require('sequelize');

const { sequelize, syncModel } = require('@/models');
const initCommonData = require('@/models/common.init');

class Common extends Model {}

Common.init(
  {
    codeValue: {
      type: DataTypes.STRING(10),
      primaryKey: true, // default: not null
      comment: '코드 값'
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '코드에 대한 설명 또는 값'
    }
  },
  {
    sequelize, // 초기화한 Sequelize 인스턴스
    modelName: 'common', // 테이블 이름
    comment: '공통코드', // 테이블 설명
    underscored: true, // 카멜케이스를 스네이크케이스로 변경
    timestamps: true // createAt, updateAt 추가 및 자동관리
  }
);

syncModel(Common);
initCommonData(Common);

module.exports = Common;
