"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseAPIProvider = exports.UseRequestProvider = exports.useLoadMore = exports.usePaginated = exports.useAsync = void 0;
/* eslint-disable react-hooks/rules-of-hooks */

var react_1 = require("react");

var useAsync_1 = __importDefault(require("./useAsync"));

exports.useAsync = useAsync_1["default"];

var useLoadMore_1 = __importDefault(require("./useLoadMore"));

exports.useLoadMore = useLoadMore_1["default"];

var usePaginated_1 = __importDefault(require("./usePaginated"));

exports.usePaginated = usePaginated_1["default"];

var configContext_1 = __importDefault(require("./configContext"));

function useRequest(service, options) {
  if (options === void 0) {
    options = {};
  }

  var contextConfig = react_1.useContext(configContext_1["default"]);

  var finalOptions = __assign(__assign({}, contextConfig), options);

  var paginated = finalOptions.paginated,
      loadMore = finalOptions.loadMore,
      requestMethod = finalOptions.requestMethod;
  var paginatedRef = react_1.useRef(paginated);
  var loadMoreRef = react_1.useRef(loadMore);

  if (paginatedRef.current !== paginated) {
    throw Error('You should not modify the paginated of options');
  }

  if (loadMoreRef.current !== loadMore) {
    throw Error('You should not modify the loadMore of options');
  }

  paginatedRef.current = paginated;
  loadMoreRef.current = loadMore; // @ts-ignore

  var fetchProxy = function fetchProxy() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    } // @ts-ignore


    return fetch.apply(void 0, __spread(args)).then(function (res) {
      if (res.ok) {
        return res.json();
      }

      throw new Error(res.statusText);
    });
  };

  var finalRequestMethod = requestMethod || fetchProxy;
  var promiseService;

  switch (typeof service) {
    case 'string':
      promiseService = function promiseService() {
        return finalRequestMethod(service);
      };

      break;

    case 'object':
      var url_1 = service.url,
          rest_1 = __rest(service, ["url"]);

      promiseService = function promiseService() {
        return requestMethod ? requestMethod(service) : fetchProxy(url_1, rest_1);
      };

      break;

    default:
      promiseService = function promiseService() {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return new Promise(function (resolve, reject) {
          var s = service.apply(void 0, __spread(args));
          var fn = s;

          if (!s.then) {
            switch (typeof s) {
              case 'string':
                fn = finalRequestMethod(s);
                break;

              case 'object':
                var url_2 = s.url,
                    rest_2 = __rest(s, ["url"]);

                fn = requestMethod ? requestMethod(s) : fetchProxy(url_2, rest_2);
                break;
            }
          }

          fn.then(resolve)["catch"](reject);
        });
      };

  }

  if (loadMore) {
    return useLoadMore_1["default"](promiseService, finalOptions);
  }

  if (paginated) {
    return usePaginated_1["default"](promiseService, finalOptions);
  }

  return useAsync_1["default"](promiseService, finalOptions);
}

var UseRequestProvider = configContext_1["default"].Provider;
exports.UseRequestProvider = UseRequestProvider; // UseAPIProvider 已经废弃，此处为了兼容 umijs 插件 plugin-request

var UseAPIProvider = UseRequestProvider;
exports.UseAPIProvider = UseAPIProvider;
exports["default"] = useRequest;