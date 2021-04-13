/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const through = require('through2');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

function write(file) {
  const dir = path.dirname(file.path);
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(file.path, file.contents, {
    mode: file.stat ? file.stat.mode : null,
  });
}

function remove(file) {
  rimraf.sync(file.path);
}

module.exports = function commit(filters, cb) {
  const { store } = this;

  // eslint-disable-next-line no-undef
  if (arguments.length === 1) {
    cb = filters;
    filters = [];
  }

  const modifiedFilter = through.obj(function (file, enc, cbModi) {
    // Don't process deleted file who haven't been commited yet.
    if (file.state === 'modified' || (file.state === 'deleted' && !file.isNew)) {
      this.push(file);
    }

    cbModi();
  });

  const commitFilter = through.obj((file, enc, cbFilter) => {
    store.add(file);
    if (file.state === 'modified') {
      write(file);
    } else if (file.state === 'deleted') {
      remove(file);
    }

    delete file.state;
    delete file.isNew;
    cbFilter();
  });

  filters.unshift(modifiedFilter);
  filters.push(commitFilter);

  const stream = filters.reduce((streamItem, filter) => {
    return streamItem.pipe(filter);
  }, this.store.stream());

  stream.on('finish', cb);
};
