/**
 * response에 statusCode를 설정하고 json형태로 return한다
 * response 형식을 통일하기 위함
 * example) {status: 200, message: "OK", data: {key1: value1, key2: value2}}
 *
 * @param {responseObject} res response object
 * @param {number} statusCode http status code
 * @param {string} message message (생략가능, 생략할 경우 포함되지 않음)
 * @param {object} data data json object (생략가능, 생략할 경우 {}로 표시)
 * @returns
 */
module.exports = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    statusCode: statusCode,
    message: message,
    data: data || {}
  });
};
