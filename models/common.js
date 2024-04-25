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
      primaryKey: true,
      comment: '코드 값'
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '코드에 대한 설명 또는 값'
    }
  },
  {
    sequelize,
    modelName: 'common',
    comment: '공통코드',
    underscored: true,
    timestamps: true
  }
);

syncModel(Common);
initCommonData(Common);

module.exports = Common;
