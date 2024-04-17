/**
 * test.service.js
 *  테스트 서비스
 */
const Test = require('@/models/test');
const convertor = require('@/common/convertor');
const logger = require('@/config/logger');

// CREATE
async function createTest(title, contents) {
  try {
    const newTest = await Test.create({
      dateTime: new Date(),
      title: title,
      contents: contents
    });
    return newTest;
  } catch (error) {
    logger.error('데이터 추가 중 오류 발생:', error);
  }
}

// READ
async function getTestList() {
  try {
    const testList = await Test.findAll();
    return testList;
  } catch (error) {
    logger.error('데이터 조회 중 오류 발생:', error);
  }
}

async function getTestById(id) {
  try {
    const test = await Test.findByPk(id);
    return test;
  } catch (error) {
    logger.error('데이터 조회 중 오류 발생:', error);
  }
}

async function getTestSize() {
  try {
    const testList = await Test.findAll();
    return testList.length;
  } catch (error) {
    logger.error('데이터 조회 중 오류 에러 발생:', error);
  }
}

// UPDATE
// DELETE

module.exports = {
  createTest,
  getTestList,
  getTestById,
  getTestSize
};
