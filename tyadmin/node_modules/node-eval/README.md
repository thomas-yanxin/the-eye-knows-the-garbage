# node-eval

Eval JS-expression, CommonJS modules and JSON with ease.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coveralls-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:           http://www.npmjs.org/package/node-eval
[npm-img]:       https://img.shields.io/npm/v/node-eval.svg

[travis]:        https://travis-ci.org/node-eval/node-eval
[test-img]:      https://img.shields.io/travis/node-eval/node-eval/master.svg?label=tests

[coveralls]:     https://coveralls.io/r/node-eval/node-eval
[coveralls-img]: https://img.shields.io/coveralls/node-eval/node-eval/master.svg

[david]:         https://david-dm.org/node-eval/node-evalenb/enb
[david-img]:     https://img.shields.io/david/node-eval/node-eval/master.svg

## Usage

### JS-expression

```js
const nodeEval = require('node-eval');

nodeEval('42 * 42'); // 1764
```

### CommonJS

```js
const nodeEval = require('node-eval');
const moduleContents =
`
    const package = require('./package.json');

    module.exports = {
        name: package.name
    };
`;

nodeEval(moduleContents, './index.js'); // filename need to provide required info to resolve relative paths inside evaluating code

// ➜ { name: 'node-eval' }
```

### JSON

```js
const nodeEval = require('node-eval');
const jsonContents = '{ "name": "node-eval" }';

nodeEval(requireContents, 'my.json'); // filename need to `node-eval` determinate json format by extention

// ➜ { name: 'node-eval' }
```

## API

### nodeEval(contents[, filename, context])

#### contents

Type: `string`

The JS-expression, CommonJS module contents or JSON contents.

#### filename

Type: `string`

The path to file which contents we execute.

The `node-eval` determinate format by extension. If filename ends with `.json` extention, its contents will be parsing with `JSON.parse`. If filename ends with `.js`, its contents will be evaluating with [vm](https://nodejs.org/dist/latest/docs/api/vm.html).

By default expected JS-expression or CommonJS module contents.

```js
const nodeEval = require('node-eval');

nodeEval('42 * 42'/* js by default */); // 1764
nodeEval('42 * 42', 'my.js'); // 1764
nodeEval('{ "name": "node-eval" }', 'my.json'); // '{ name: 'node-eval' }'
```

To evaluating CommonJS module contents filename is required to resolve relative paths inside evaluating code.

```js
const nodeEval = require('node-eval');
const moduleContents =
`
    const package = require('./package.json'); // to resolve this require need to know the path of current module (./index.js)

    module.exports = {
        name: package.name
    };
`;

nodeEval(moduleContents, './index.js'); // filename need to provide required info to resolve relative paths inside evaluating code
```

Internally `node-eval` will resolve passed relative paths using the place it's called (like `require` do).

It may spend additional processor's time on it, so better to pass in absolute path.

```js
const fs = require('fs');
const nodeEval = require('node-eval');

// For example, current path is "/repos/project/lib/file.js".
const modulePath = '../files/another.js';
const moduleContents = fs.readFileSync(modulePath, 'utf-8');

// '../files/another.js' will be resolved to '/repos/project/files/another.js'
nodeEval(moduleContents, modulePath);
```

#### context

Type: `Object`

The object to provide into execute method.

If `context` is specified, then module contents will be evaluating with `vm.runInNewContext`.

If `context` is not specified, then module contents will be evaluating with `vm.runInThisContext`.

With `context` you can provide some like-a-global variables into `node-eval`.

```js
const nodeEval = require('node-eval');

const secretKey = '^___^';
const contents = 'module.exports = secretKey;';

nodeEval(content, { secretKey }); // '^___^'
```

## Related

* [file-eval](https://github.com/node-eval/file-eval)

