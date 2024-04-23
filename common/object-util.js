const { isEmpty } = require('@/common/validate');

/**
 *
 * @param {*} object
 * @param {*} updateParams
 */
function updateProperties(object, updateParams) {
  for (let key in updateParams) {
    if (!isEmpty(updateParams[key])) {
      object[key] = updateParams[key];
    }
  }
}

module.exports = {
  updateProperties
};
