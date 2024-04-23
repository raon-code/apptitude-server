/**
 * test.service.js
 *  테스트 서비스
 */
const Test = require('@/models/test');
const logger = require('@/config/logger');
const { BizError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { isEmpty } = require('@/common/validate');

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

async function getTest(id) {
  const test = await Test.findByPk(id);
  return test || {};
}

async function getTestSize() {
  const testList = await Test.findAll();
  return testList.length;
}

// UPDATE
async function updateTest(id, updateParams) {
  const test = await Test.findByPk(id);
  if (isEmpty(test)) {
    throw new BizError('수정할 데이터가 없습니다. 다시 확인해주세요.');
  }
  updateProperties(test, updateParams);
  await test.save();
  return test;
}

// DELETE
async function deleteTest(id) {
  const test = await Test.findByPk(id);
  if (isEmpty(test)) {
    throw new BizError('삭제할 데이터가 없습니다. 다시 확인해주세요.');
  }
  await test.destroy();
}

// TEST
async function getBizError() {
  throw new BizError('에러 테스트 입니다!!');
}

module.exports = {
  createTest,
  getTestList,
  getTest,
  getTestSize,
  updateTest,
  deleteTest,
  getBizError
};
