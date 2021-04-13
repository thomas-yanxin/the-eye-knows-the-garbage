/* eslint-disable no-param-reassign */
const extend = require('deep-extend');
const ejs = require('ejs');
const { isBinaryFileSync } = require('isbinaryfile');

function render(contents, filename, context, tplSettings) {
  let result;
  const contentsBuffer = Buffer.from(contents, 'binary');
  if (isBinaryFileSync(contentsBuffer, contentsBuffer.length)) {
    result = contentsBuffer;
  } else {
    result = ejs.render(
      contents.toString(),
      context,
      // Setting filename by default allow including partials.
      extend({ filename }, tplSettings),
    );
  }

  return result;
}

module.exports = function copyTpl(from, to, context, tplSettings, options) {
  context = context || {};
  tplSettings = tplSettings || {};
  this.copy(
    from,
    to,
    extend(options || {}, {
      process(contents, filename) {
        return render(contents, filename, context, tplSettings);
      },
    }),
    context,
    tplSettings,
  );
};
