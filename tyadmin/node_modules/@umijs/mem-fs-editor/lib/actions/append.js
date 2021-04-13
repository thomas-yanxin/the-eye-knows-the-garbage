const extend = require('deep-extend');
const { EOL } = require('os');

module.exports = function append(to, contents, options) {
  const newOptions = extend(
    {
      trimEnd: true,
      separator: EOL,
    },
    options || {},
  );

  let currentContents = this.read(to);
  if (newOptions.trimEnd) {
    currentContents = currentContents.replace(/\s+$/, '');
  }

  this.write(to, currentContents + newOptions.separator + contents);
};
