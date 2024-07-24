/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const e = require('express');

async function createBattle() {}

async function getBattleList() {}

async function getBattle() {}

function isOwnUserBattle() {}

function checkBattleFinished() {}

async function updateBattle() {}

async function finishBattle() {}

async function cancelBattle() {}

async function createInvitationURL() {}

async function getInvitationHistoryList() {}

module.exports = {
  createBattle,
  getBattleList,
  getBattle,
  isOwnUserBattle,
  checkBattleFinished,
  updateBattle,
  finishBattle,
  cancelBattle,
  createInvitationURL,
  getInvitationHistoryList
};
