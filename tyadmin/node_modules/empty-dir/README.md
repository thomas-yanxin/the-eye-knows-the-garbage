<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# empty-dir

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Travis Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Check if a directory is empty.

## Usage

```js
var emptyDir = require('empty-dir');

// Using an error-back
emptyDir('./', function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log('Directory is empty:', result);
  }
});

// Using a Promise
emptyDir('./').then(function(result) {
  console.log('Directory is empty:', result);
});

var result = emptyDir.sync('./test/empty');
console.log('Directory is empty:', result);
```

## API

### `emptyDir(paths, [filterFunction], [callback])`

Takes a path string or array of path strings and returns a Promise. Checks if the given paths are empty and resolves with a boolean indicating if the paths are empty directories. Optionally takes a filter function to filter out files that cause false positives. Also, can take a node-style callback function instead of returning a Promise.

### `emptyDir.sync(paths, [filterFunction])`

Same as the above API but operates and returns synchronously. An error will be thrown.

#### Filter function

Both async and sync take a filter function as the second argument, to ignore files like `.DS_Store` on mac or `Thumbs.db` on windows from causing false-negatives.

```js
var emptyDir = require('empty-dir');

function filter(filepath) {
  return !/(Thumbs\.db|\.DS_Store)$/i.test(filepath);
}

emptyDir('./', filter, function(err, isEmpty) {
  if (err) {
    console.error(err);
  } else {
    console.log('Directory is empty:', isEmpty);
  }
});

var isEmpty = emptyDir.sync('./test/empty', filter);
console.log('Directory is empty:', isEmpty);
```

#### Promises

Global promises are required for this module. If you are using a platform that doesn't have promise support, you'll need to polyfill Promise on the global.

```js
global.Promise = require('insert-your-promise-polyfill-here');

var emptyDir = require('empty-dir');

emptyDir('./').then(function(result) {
  console.log('Directory is empty:', result);
});
```

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/empty-dir.svg
[npm-url]: https://www.npmjs.com/package/empty-dir
[npm-image]: http://img.shields.io/npm/v/empty-dir.svg

[travis-url]: https://travis-ci.org/gulpjs/empty-dir
[travis-image]: http://img.shields.io/travis/gulpjs/empty-dir.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/empty-dir
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/empty-dir.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/empty-dir
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/empty-dir/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
