const fs = require('fs');
const path = require('path');
const commondir = require('commondir');
const glob = require('glob');
const slash2 = require('slash2');

function notNullOrExclusion(file) {
  return file != null && file.charAt(0) !== '!';
}

exports.getCommonPath = filePath => {
  let newFilePath = filePath;
  if (Array.isArray(newFilePath)) {
    return commondir(newFilePath.filter(notNullOrExclusion).map(this.getCommonPath.bind(this)));
  }

  const globStartIndex = newFilePath.indexOf('*');
  if (globStartIndex !== -1) {
    newFilePath = newFilePath.substring(0, globStartIndex + 1);
  } else if (fs.existsSync(newFilePath) && fs.statSync(newFilePath).isDirectory()) {
    return newFilePath;
  }

  return path.dirname(newFilePath);
};

exports.globify = filePath => {
  if (Array.isArray(filePath)) {
    return filePath
      .reduce((memo, pattern) => memo.concat(this.globify(pattern)), [])
      .map(filePathItem => slash2(filePathItem));
  }

  if (glob.hasMagic(filePath)) {
    return slash2(filePath);
  }
  if (!fs.existsSync(filePath)) {
    // The target of a pattern who's not a glob and doesn't match an existing
    // entity on the disk is ambiguous. As such, match both files and directories.
    return [filePath, slash2(path.join(filePath, '**'))];
  }

  const fsStats = fs.statSync(filePath);
  if (fsStats.isFile()) {
    return slash2(filePath);
  }

  if (fsStats.isDirectory()) {
    return slash2(path.join(filePath, '**'));
  }

  throw new Error('Only file path or directory path are supported.');
};

const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
exports.winEol = content => {
  if (typeof content !== 'string') {
    return content;
  }

  return isWindows ? content.replace(/\r/g, '') : content;
};
