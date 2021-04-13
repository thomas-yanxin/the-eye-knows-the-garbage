/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

const path = require('path');
const globby = require('globby');
const multimatch = require('multimatch');
const util = require('../util');

function deleteFile(path, store) {
  const file = store.get(path);
  file.state = 'deleted';
  file.contents = null;
  store.add(file);
}

module.exports = function (paths, options) {
  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  paths = paths.map(function (filePath) {
    return path.resolve(filePath);
  });
  paths = util.globify(paths);
  options = options || {};
  const globOptions = options.globOptions || {};
  const files = globby.sync(paths, globOptions);
  files.forEach(
    function (file) {
      deleteFile(file, this.store);
    }.bind(this),
  );

  this.store.each(
    function (file) {
      if (multimatch([file.path], paths).length !== 0) {
        deleteFile(file.path, this.store);
      }
    }.bind(this),
  );
};
