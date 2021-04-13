const fetch = require("node-fetch");

const isInChinaByIp = async url => {
  const text = await fetch("http://myip.ipip.net").then(msg => {
    return msg.text();
  });
  if (text.includes("中国")) {
    return true;
  }
  return false;
};

const registryMap = {
  taobao: "https://registry.npm.taobao.org",
  npm: "https://registry.npmjs.org"
};

const getNpmRegistry = async () => {
  return new Promise(resolve => {
    Object.keys(registryMap).forEach(async key => {
      await fetch(registryMap[key]).then(msg => {
        return msg.text();
      });
      resolve(registryMap[key]);
    });
  });
};

const util = async () => {
  return await getNpmRegistry();
};
util.isInChinaByIp = isInChinaByIp;
module.exports = util;
