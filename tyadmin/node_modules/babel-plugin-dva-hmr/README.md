# babel-plugin-dva-hmr

[![NPM version](https://img.shields.io/npm/v/babel-plugin-dva-hmr.svg?style=flat)](https://npmjs.org/package/babel-plugin-dva-hmr)
[![Build Status](https://img.shields.io/travis/dvajs/babel-plugin-dva-hmr.svg?style=flat)](https://travis-ci.org/dvajs/babel-plugin-dva-hmr)
[![Coverage Status](https://img.shields.io/coveralls/dvajs/babel-plugin-dva-hmr.svg?style=flat)](https://coveralls.io/r/dvajs/babel-plugin-dva-hmr)
[![NPM downloads](http://img.shields.io/npm/dm/babel-plugin-dva-hmr.svg?style=flat)](https://npmjs.org/package/babel-plugin-dva-hmr)

HMR babel plugin for dva.

---

## Install

```bash
$ npm install babel-plugin-dva-hmr redbox-react@1.x --save-dev
```

## Usage

.babelrc

```javascript
{
  "plugins": ["dva-hmr"]
}
```

Configure it in .roadhogrc(configure file for [roadhog](https://github.com/sorrycc/roadhog)) only in development mode, [example](https://github.com/dvajs/dva-example-user-dashboard/blob/d6da33b/.roadhogrc#L24-L30)

```javascript
"env": {
  "development": {
    "extraBabelPlugins": [
      "dva-hmr"
    ]
  }
}
```

## Options
* `container` —— Specify the root element for `app.start()`.
* `quiet` —— Don't output any log.
* `disableModel` —— Disable model HMR.

## License

MIT
