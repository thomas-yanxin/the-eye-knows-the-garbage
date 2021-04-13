var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
};

import request from 'umi-request';
import useAsync from './useAsync';

function useRequest(service, options) {
  var promiseService;

  if (typeof service === 'string') {
    promiseService = function promiseService() {
      return request(service);
    };
  } else if (typeof service === 'object') {
    var url_1 = service.url,
        rest_1 = __rest(service, ["url"]);

    promiseService = function promiseService() {
      return request(url_1, rest_1);
    };
  } else {
    promiseService = function promiseService() {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return new Promise(function (resolve) {
        var result = service.apply(void 0, __spread(args));

        if (typeof result === 'string') {
          request(result).then(function (data) {
            resolve(data);
          });
        } else if (typeof result === 'object') {
          var url = result.url,
              rest = __rest(result, ["url"]);

          request(url, rest).then(function (data) {
            resolve(data);
          });
        }
      });
    };
  }

  return useAsync(promiseService, options);
}

export default useRequest;