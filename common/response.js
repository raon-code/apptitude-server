/**
 * response.js
 * 
 * response 형식을 통일하기 위한 공통함수
 * 
 * response에 statusCode를 설정하고 json형태로 return한다
 * example) {status: 200, message: "OK", data: {key1: value1, key2: value2}}
 *
 * @param {responseObject} res response object
 * @param {number} statusCode http status code
 * @param {string} message message (optional)
 * @param {object} data data json object (optional)
 * @returns
 */
module.exports = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    statusCode: statusCode,
    message: message,
    data: data || {}
  });
};
