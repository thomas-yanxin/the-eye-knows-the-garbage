const isWebpackError = require('../../utils/isWebpackError');

module.exports = {
  test({ context }) {
    return context.dll && isWebpackError(context, 'ModuleNotFoundError');
  },
};
