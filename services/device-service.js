/**
 * device-service.js
 *  기기관련 서비스
 */
const Device = require('@/models/device');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createDevice() {}

async function getDevice() {}

module.exports = {
  createDevice,
  getDevice
};
