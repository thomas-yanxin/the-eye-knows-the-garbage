# cross-port-killer

[![Build Status](https://travis-ci.org/milewski/cross-port-killer.svg?branch=master)](https://travis-ci.org/milewski/cross-port-killer)
[![npm version](https://badge.fury.io/js/cross-port-killer.svg)](https://badge.fury.io/js/cross-port-killer)
[![npm downloads](https://img.shields.io/npm/dm/cross-port-killer.svg)](https://www.npmjs.com/package/cross-port-killer)
[![dependencies](https://david-dm.org/milewski/cross-port-killer.svg)](https://www.npmjs.com/package/cross-port-killer)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![greenkeeper](https://badges.greenkeeper.io/milewski/cross-port-killer.svg)](https://greenkeeper.io)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Kill the process running on a given TCP port on **Windows**, **Linux** and **Mac**

## Install

```bash
$ npm install cross-port-killer -D
```

## Usage

```js
import { kill, killer } from 'cross-port-killer';

kill(9090).then(pids => {
  console.log(pids)
})

// you could also kill pids manually if you know them... this would save you bringing up another lib, you are welcome.

killer.killByPid(12345).then(() => console.log('done'))
killer.killByPids([12345, 54321]).then(() => console.log('done'))
```
This lib also comes with a `CLI`.

To kill any process occupying the port 9090 you can run:

```bash
$ npx cross-port-killer 9090
```

or

```bash
$ npm install cross-port-killer -g
```
```bash
$ kill-port 9090
```

## Dependencies

On **Linux**/**Mac** this library depends on `lsof` in case you don't have it installed (perhaps you are using docker?) run:

```bash
$ apt-get install lsof
```

On **Mac**, It comes with the OS by default so nothing to worries.

## License 

[MIT](LICENSE) © [Rafael Milewski](https://rafael-milewski.com?github=readme)
