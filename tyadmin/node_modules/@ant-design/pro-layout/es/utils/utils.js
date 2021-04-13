import { useRef, useEffect } from 'react';
import isEqual from 'lodash.isequal';
import { stringify } from 'use-json-comparison';
import hash from 'hash.js';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export var isUrl = function isUrl(path) {
  return reg.test(path);
};
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
export var isBrowser = function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined' && !isNode;
};
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    var r = Math.random() * 16 | 0; // eslint-disable-next-line no-bitwise

    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
export var getKeyByPath = function getKeyByPath(item) {
  var path = item.path,
      name = item.name;

  if (path && path !== '/') {
    return path;
  } // 如果有name, 使用name


  if (name) {
    return name;
  } // 如果还是没有，用对象的hash 生成一个


  try {
    return hash.sha256().update(stringify(item)).digest('hex');
  } catch (error) {// dom some thing
  } // 要是还是不行，返回一个随机值


  return guid();
};
export var getOpenKeysFromMenuData = function getOpenKeysFromMenuData(menuData) {
  if (!menuData) {
    return undefined;
  }

  return menuData.reduce(function (pre, item) {
    if (item.key) {
      pre.push(item.key);
    }

    if (item.children) {
      var newArray = pre.concat(getOpenKeysFromMenuData(item.children) || []);
      return newArray;
    }

    return pre;
  }, []);
};

function deepCompareEquals(a, b) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  var ref = useRef(); // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(effect, dependencies) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}
var themeConfig = {
  daybreak: 'daybreak',
  '#1890ff': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#52C41A': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple'
};

var invertKeyValues = function invertKeyValues(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[obj[key]] = key;
    return acc;
  }, {});
};
/**
 * #1890ff -> daybreak
 * @param val
 */


export function genThemeToString(val) {
  return val && themeConfig[val] ? themeConfig[val] : val;
}
/**
 * daybreak-> #1890ff
 * @param val
 */

export function genStringToTheme(val) {
  var stringConfig = invertKeyValues(themeConfig);
  return val && stringConfig[val] ? stringConfig[val] : val;
}
export var usePrevious = function usePrevious(state) {
  var ref = useRef();
  useEffect(function () {
    ref.current = state;
  });
  return ref.current;
};
export function debounce(func, wait, immediate) {
  // immediate默认为false
  var timeout;
  var args;
  var context;
  var timestamp;
  var result;

  var _debounceFunction; // eslint-disable-next-line no-var


  var later = function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = window.setTimeout(later, wait - last);
      _debounceFunction.id = timeout;
    } else {
      timeout = null;

      if (!immediate) {
        result = func.apply(context, args); // eslint-disable-next-line no-multi-assign

        if (!timeout) context = args = null;
      }
    }
  }; // eslint-disable-next-line func-names


  _debounceFunction = function debounceFunction() {
    // @ts-ignore
    context = this; // eslint-disable-next-line prefer-rest-params

    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;

    if (!timeout) {
      timeout = window.setTimeout(later, wait);
      _debounceFunction.id = timeout;
    }

    if (callNow) {
      result = func.apply(context, args); // eslint-disable-next-line no-multi-assign

      context = args = null;
    }

    return result;
  };

  return _debounceFunction;
}