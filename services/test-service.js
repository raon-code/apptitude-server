/**
 * test.service.js
 *  테스트 서비스
 */
const Test = require('@/models/test');
const logger = require('@/config/logger');
const { BizError } = require('@/error');

// CREATE
async function createTest(title, contents) {
  const newTest = await Test.create({
    dateTime: new Date(),
    title: title,
    contents: contents
  });
  return newTest;
}

// READ
async function getTestList() {
  const testList = await Test.findAll();
  return testList;
}

async function getTestById(id) {
  const test = await Test.findByPk(id);
  return test;
}

async function getTestSize() {
  const testList = await Test.findAll();
  return testList.length;
}

// UPDATE
// DELETE

// TEST
async function getBizError() {
  throw new BizError('에러 테스트 입니다!!');
}

module.exports = {
  createTest,
  getTestList,
  getTestById,
  getTestSize,

  getBizError
};
