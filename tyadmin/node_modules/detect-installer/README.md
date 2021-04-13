# @umi-material/detect-installler

Determine what package manager should be used

## Usage

```sh
yarn add detect-installer
```

```js
const detect = require('detect-installer');
detect(__dirname); // ['tyarn',"yarn"]

// find you install package manger
detect(__dirname).find(detect.hasPackageCommand) // yarn
```

## LICENSE

MIT
