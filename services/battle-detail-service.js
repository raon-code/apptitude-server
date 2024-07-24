/**
 * battle-detail-service.js
 *  대결상세 관련 서비스
 */
const BattleDetail = require('@/models/battle-detail');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createBattleDetail() {}

async function getBattleDetailList() {}

async function getBattleDetail() {}

module.exports = {
  createBattleDetail,
  getBattleDetailList,
  getBattleDetail
};
