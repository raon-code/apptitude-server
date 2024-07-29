const { isEmpty } = require('@/common/validate');
const { PLATFORM_TYPE_MAP } = require('@/enum/platform-type');

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
