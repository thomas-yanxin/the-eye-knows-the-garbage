/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const globby = require('globby');
const extend = require('deep-extend');
const multimatch = require('multimatch');
const ejs = require('ejs');
const util = require('../util');

async function applyProcessingFunc(process, contents, filename) {
  const output = await process(contents, filename);
  return output instanceof Buffer ? output : Buffer.from(output);
}

exports.copyAsync = async function copy(from, to, options, context, tplSettings) {
  to = path.resolve(to);
  options = options || {};
  const fromGlob = util.globify(from);
  const globOptions = extend(options.globOptions || {}, { nodir: true });
  const diskFiles = globby.sync(fromGlob, globOptions);
  const storeFiles = [];
  this.store.each((file) => {
    // The store may have a glob path and when we try to copy it will fail because not real file
    if (!glob.hasMagic(file.path) && multimatch([file.path], fromGlob).length !== 0) {
      storeFiles.push(file.path);
    }
  });
  const files = diskFiles.concat(storeFiles);

  let generateDestination = () => to;
  if (Array.isArray(from) || !this.exists(from) || glob.hasMagic(from)) {
    assert(
      !this.exists(to) || fs.statSync(to).isDirectory(),
      'When copying multiple files, provide a directory as destination',
    );

    const root = util.getCommonPath(from);
    generateDestination = (filepath) => {
      const toFile = path.relative(root, filepath);
      return path.join(to, toFile);
    };
  }

  // Sanity checks: Makes sure we copy at least one file.
  assert(
    options.ignoreNoMatch || files.length > 0,
    `Trying to copy from a source that does not exist: ${from}`,
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    await this._copySingleAsync(file, generateDestination(file), options, context, tplSettings);
  }
};

exports._copySingleAsync = async function copySingle(from, to, options, context, tplSettings) {
  options = options || {};

  assert(this.exists(from), `Trying to copy from a source that does not exist: ${from}`);

  const file = this.store.get(from);

  let { contents } = file;
  if (options.process) {
    contents = await applyProcessingFunc(options.process, file.contents, file.path);
  }

  if (context) {
    // eslint-disable-next-line no-param-reassign
    to = ejs.render(to, context, tplSettings);
  }

  this.write(to, contents, file.stat);
};
