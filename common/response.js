/**
 * response에 statusCode를 설정하고 json형태로 return한다
 * response 형식을 통일하기 위함
 *
 * @param {responseObject} res response object
 * @param {number} status http status code
 * @param {string} message message (생략가능, 생략할 경우 포함되지 않음)
 * @param {object} data data json object (생략가능, 생략할 경우 {}로 표시)
 * @returns
 */
module.exports = (res, status, message, data) => {
  return res.status(status).json({
    status: status,
    message: message,
    data: data || {}
  });
};
