"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCache = exports.getCache = void 0;
var cache = new Map();

var setCache = function setCache(key, cacheTime, data) {
  var currentCache = cache.get(key);

  if (currentCache === null || currentCache === void 0 ? void 0 : currentCache.timer) {
    clearTimeout(currentCache.timer);
  }

  var timer = undefined;

  if (cacheTime > -1) {
    // 数据在不活跃 cacheTime 后，删除掉
    timer = setTimeout(function () {
      cache["delete"](key);
    }, cacheTime);
  }

  cache.set(key, {
    data: data,
    timer: timer,
    startTime: new Date().getTime()
  });
};

exports.setCache = setCache;

var getCache = function getCache(key) {
  var currentCache = cache.get(key);
  return {
    data: currentCache === null || currentCache === void 0 ? void 0 : currentCache.data,
    startTime: currentCache === null || currentCache === void 0 ? void 0 : currentCache.startTime
  };
};

exports.getCache = getCache;