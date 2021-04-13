# umi-plugin-antd-icon-config

[![NPM version](https://img.shields.io/npm/v/umi-plugin-antd-icon-config.svg?style=flat)](https://npmjs.org/package/umi-plugin-antd-icon-config)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-antd-icon-config.svg?style=flat)](https://npmjs.org/package/umi-plugin-antd-icon-config)

Convert icon string to antd@4

由于 pro-layout 支持在 config 中 `icon:string` 的配置，但是在 4.0 中不推荐这样的用法。这个插件可以将其转化，不再引入全量的 icon。

## Install

```bash
# or yarn
$ npm install
```

```bash
$ npm run build --watch
$ npm run start
```

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [['umi-plugin-antd-icon-config', {}]],
};
```

## Options

TODO

## LICENSE

MIT
