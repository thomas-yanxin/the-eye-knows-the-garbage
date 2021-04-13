const getNpmRegistry = require("./index");

console.log(
  getNpmRegistry().then(url => {
    console.log(url);
  })
);

console.log(getNpmRegistry.isInChinaByIp());
