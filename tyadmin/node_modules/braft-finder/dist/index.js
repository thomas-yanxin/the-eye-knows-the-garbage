(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("react")) : factory(root["react"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var compressImage = exports.compressImage = function compressImage(url) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1280;
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 800;


  return new Promise(function (resolve, reject) {

    var image = new Image();

    image.src = url;

    image.onerror = function (error) {
      reject(error);
    };

    image.onload = function () {

      try {

        var compressCanvas = document.createElement('canvas');
        var scale = this.width > width || this.height > height ? this.width > this.height ? width / this.width : height / this.height : 1;

        compressCanvas.width = this.width * scale;
        compressCanvas.height = this.height * scale;

        var canvasContext = compressCanvas.getContext('2d');
        canvasContext.drawImage(this, 0, 0, compressCanvas.width, compressCanvas.height);

        resolve({
          url: compressCanvas.toDataURL('image/png', 1),
          width: compressCanvas.width,
          height: compressCanvas.height
        });
      } catch (error) {
        reject(error);
      }
    };
  });
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var UniqueIndex = exports.UniqueIndex = function UniqueIndex() {

  if (isNaN(window.__BRAFT_MM_UNIQUE_INDEX__)) {
    window.__BRAFT_MM_UNIQUE_INDEX__ = 1;
  } else {
    window.__BRAFT_MM_UNIQUE_INDEX__ += 1;
  }

  return window.__BRAFT_MM_UNIQUE_INDEX__;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: 'Kaldır',
  cancel: 'İptal',
  confirm: 'Onayla',
  insert: 'Seçilenleri ekle',
  width: 'Genişlik',
  height: 'Yükseklik',
  image: 'Resim',
  video: 'Görüntü',
  audio: 'Ses',
  embed: 'Nesne göm',
  caption: 'Kitaplık',
  dragTip: 'Tıkla ya da dosya sürükle',
  dropTip: 'Yüklemek için sürükleyin',
  selectAll: 'Tümünü seç',
  deselect: 'Seçimi kaldır',
  removeSelected: 'Seçilenleri kaldır',
  externalInputPlaceHolder: 'Kaynak adı|Kaynak bağlantısı',
  externalInputTip: 'Kaynak asını ve bağlantısını "|" ile ayırın ve Enter\' a basın.',
  addLocalFile: 'Yerel\' den ekle',
  addExternalSource: 'Harici kaynaktan ekle',
  unnamedItem: 'Adlandırılmamış giriş',
  confirmInsert: 'Seçilenleri ekle'
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: '削除する',
  cancel: 'キャンセル',
  confirm: '確認する',
  insert: '選択したアイテムを挿入',
  width: '幅',
  height: '身長',
  image: '絵',
  video: 'ビデオ',
  audio: '音声',
  embed: '埋め込みメディア',
  caption: 'メディアライブラリー',
  dragTip: 'ファイルをこの位置までクリックまたはドラッグします',
  dropTip: 'アップロードするマウスを放します',
  selectAll: 'すべて選択',
  deselect: '選択を解除',
  removeSelected: '選択したアイテムを削除',
  externalInputPlaceHolder: 'リソース名|リソースアドレス',
  externalInputTip: 'リソース名とリソースアドレスは "|"で区切ります。',
  addLocalFile: 'ローカルリソースを追加する',
  addExternalSource: 'ネットワークリソースを追加する',
  unnamedItem: '名前のないアイテム',
  confirmInsert: '選択したアイテムを挿入'
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: '삭제',
  cancel: '취소',
  confirm: '확인',
  insert: '선택한항목삽입',
  width: '너비',
  height: '높이',
  image: '그림',
  video: '비디오',
  audio: '오디오',
  embed: '임베디드미디어',
  caption: '미디어라이브러리',
  dragTip: '파일을 클릭하거나이 지점으로 드래그하십시오.',
  dropTip: '업로드하려면마우스를놓으십시오.',
  selectAll: '모두 선택',
  deselect: '선택 취소',
  removeSelected: '선택한 항목 삭제',
  externalInputPlaceHolder: '리소스 이름 | 리소스 주소',
  externalInputTip: '자원 이름과 자원 주소를 "|"',
  addLocalFile: '로컬 리소스 추가',
  addExternalSource: '네트워크 리소스 추가',
  unnamedItem: '이름없는 항목',
  confirmInsert: '선택한 항목 삽입'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: 'Usuń',
  cancel: 'Anuluj',
  confirm: 'Potwierdź',
  insert: 'Wstaw wybrane elementy',
  width: 'Szerokość',
  height: 'Wysokość',
  image: 'Obraz',
  video: 'Wideo',
  audio: 'Dźwięk',
  embed: 'Obiekt',
  caption: 'Biblioteka mediów',
  dragTip: 'Kliknij lub przenieś tu pliki',
  dropTip: 'Upuść aby dodać plik',
  selectAll: 'Zaznacz wszystko',
  deselect: 'Odznacz',
  removeSelected: 'Usuń wybrane',
  externalInputPlaceHolder: 'Nazwa źródła|Adres URL',
  externalInputTip: 'Oddziel nazwę i adres URL źródła z pomocą "|", Potwierdź Enter-em',
  addLocalFile: 'Dodaj z komputera',
  addExternalSource: 'Dodaj z Internetu',
  unnamedItem: 'Bez nazwy',
  confirmInsert: 'Dodaj wybrane elementy'
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: '删除',
  cancel: '取消',
  confirm: '确认',
  insert: '插入所选项目',
  width: '宽度',
  height: '高度',
  image: '图片',
  video: '视频',
  audio: '音频',
  embed: '嵌入式媒体',
  caption: '媒体库',
  dragTip: '点击或拖动文件至此',
  dropTip: '放开鼠标以上传',
  selectAll: '选择全部',
  deselect: '取消选择',
  removeSelected: '删除选中项目',
  externalInputPlaceHolder: '资源名称|资源地址',
  externalInputTip: '使用“|”分隔资源名称和资源地址',
  addLocalFile: '添加本地资源',
  addExternalSource: '添加网络资源',
  unnamedItem: '未命名项目',
  confirmInsert: '插入选中项目'
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: '删除',
  cancel: '取消',
  confirm: '确认',
  insert: '插入所选项目',
  width: '宽度',
  height: '高度',
  image: '图片',
  video: '视频',
  audio: '音频',
  embed: '嵌入式媒体',
  caption: '媒体库',
  dragTip: '点击或拖动文件至此',
  dropTip: '放开鼠标以上传',
  selectAll: '选择全部',
  deselect: '取消选择',
  removeSelected: '删除选中项目',
  externalInputPlaceHolder: '资源名称|资源地址',
  externalInputTip: '使用“|”分隔资源名称和资源地址',
  addLocalFile: '添加本地资源',
  addExternalSource: '添加网络资源',
  unnamedItem: '未命名项目',
  confirmInsert: '插入选中项目'
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  remove: 'Remove',
  cancel: 'Cancel',
  confirm: 'Confirm',
  insert: 'Insert Selected Items',
  width: 'Width',
  height: 'Height',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  embed: 'Embed',
  caption: 'Media Library',
  dragTip: 'Click Or Drag Files Here',
  dropTip: 'Drop To Upload',
  selectAll: 'Select All',
  deselect: 'Deselect',
  removeSelected: 'Remove Selected Items',
  externalInputPlaceHolder: 'Source Name|Source URL',
  externalInputTip: 'Split source name and source URL with "|", confirm by hit Enter.',
  addLocalFile: 'Add from local',
  addExternalSource: 'Add from Internet',
  unnamedItem: 'Unnamed Item',
  confirmInsert: 'Insert selected items'
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _en = __webpack_require__(9);

var _en2 = _interopRequireDefault(_en);

var _zh = __webpack_require__(8);

var _zh2 = _interopRequireDefault(_zh);

var _zhHant = __webpack_require__(7);

var _zhHant2 = _interopRequireDefault(_zhHant);

var _pl = __webpack_require__(6);

var _pl2 = _interopRequireDefault(_pl);

var _kr = __webpack_require__(5);

var _kr2 = _interopRequireDefault(_kr);

var _jpn = __webpack_require__(4);

var _jpn2 = _interopRequireDefault(_jpn);

var _tr = __webpack_require__(3);

var _tr2 = _interopRequireDefault(_tr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  "en": _en2.default,
  "zh": _zh2.default,
  "zh-hant": _zhHant2.default,
  "pl": _pl2.default,
  "kr": _kr2.default,
  "jpn": _jpn2.default,
  "tr": _tr2.default
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:font/ttf;base64,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"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(15);
exports = module.exports = __webpack_require__(14)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: 'bf-icons';\n  src: url(" + escape(__webpack_require__(13)) + ") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal; }\n\n.braft-finder [class^=\"braft-icon-\"], .braft-finder [class*=\" braft-icon-\"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'bf-icons' !important;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.braft-finder .braft-icon-code:before {\n  content: \"\\E903\"; }\n\n.braft-finder .braft-icon-pause:before {\n  content: \"\\E034\"; }\n\n.braft-finder .braft-icon-play_arrow:before {\n  content: \"\\E037\"; }\n\n.braft-finder .braft-icon-bin:before {\n  content: \"\\E9AC\"; }\n\n.braft-finder .braft-icon-replay:before {\n  content: \"\\E042\"; }\n\n.braft-finder .braft-icon-close:before {\n  content: \"\\E913\"; }\n\n.braft-finder .braft-icon-music:before {\n  content: \"\\E90E\"; }\n\n.braft-finder .braft-icon-camera:before {\n  content: \"\\E911\"; }\n\n.braft-finder .braft-icon-file-text:before {\n  content: \"\\E926\"; }\n\n.braft-finder .braft-icon-film:before {\n  content: \"\\E91C\"; }\n\n.braft-finder .braft-icon-paste:before {\n  content: \"\\E92D\"; }\n\n.braft-finder .braft-icon-spinner:before {\n  content: \"\\E980\"; }\n\n.braft-finder .braft-icon-media:before {\n  content: \"\\E90F\"; }\n\n.braft-finder .braft-icon-add:before {\n  content: \"\\E918\"; }\n\n.braft-finder .braft-icon-done:before {\n  content: \"\\E912\"; }\n\n.braft-finder .braft-icon-drop-down:before {\n  content: \"\\E906\"; }\n\n.braft-finder .braft-icon-drop-up:before {\n  content: \"\\E909\"; }\n\n.braft-finder .braft-icon-help:before {\n  content: \"\\E902\"; }\n\n.braft-finder .braft-icon-info:before {\n  content: \"\\E901\"; }\n\n.braft-finder .braft-icon-menu:before {\n  content: \"\\E908\"; }\n\n.pull-left {\n  float: left; }\n\n.pull-right {\n  float: right; }\n\n.braft-finder .bf-uploader {\n  position: relative;\n  height: 370px;\n  margin: 0; }\n  .braft-finder .bf-uploader.draging .bf-list-wrap,\n  .braft-finder .bf-uploader.draging .bf-add-external {\n    pointer-events: none; }\n  .braft-finder .bf-uploader input::-webkit-input-placeholder {\n    color: #ccc; }\n  .braft-finder .bf-uploader input::-moz-placeholder {\n    color: #ccc; }\n  .braft-finder .bf-uploader input::-ms-input-placeholder {\n    color: #ccc; }\n\n.braft-finder .bf-list-wrap {\n  position: relative;\n  height: 370px; }\n\n.braft-finder .bf-list-tools {\n  z-index: 1;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  height: 20px;\n  padding: 0 15px;\n  background-color: #fff; }\n  .braft-finder .bf-list-tools span {\n    height: 26px;\n    font-size: 12px;\n    line-height: 20px;\n    cursor: pointer;\n    user-select: none; }\n    .braft-finder .bf-list-tools span[disabled] {\n      opacity: .3;\n      pointer-events: none; }\n  .braft-finder .bf-list-tools .bf-select-all,\n  .braft-finder .bf-list-tools .bf-deselect-all {\n    float: left;\n    margin-right: 5px;\n    color: #bbb; }\n    .braft-finder .bf-list-tools .bf-select-all:hover,\n    .braft-finder .bf-list-tools .bf-deselect-all:hover {\n      color: #3498db; }\n  .braft-finder .bf-list-tools .bf-remove-selected {\n    float: right;\n    color: #e74c3c; }\n    .braft-finder .bf-list-tools .bf-remove-selected:hover {\n      color: #c92e1e; }\n\n.braft-finder .bf-list {\n  position: absolute;\n  z-index: 1;\n  top: 30px;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  margin: 0;\n  padding: 0 10px;\n  list-style: none;\n  overflow: auto; }\n  .braft-finder .bf-list::-webkit-scrollbar {\n    width: 5px;\n    height: 5px;\n    background-color: #fff; }\n  .braft-finder .bf-list::-webkit-scrollbar-track {\n    background-color: #fff; }\n  .braft-finder .bf-list::-webkit-scrollbar-thumb {\n    background-color: rgba(0, 0, 0, 0.1); }\n\n.braft-finder .bf-item,\n.braft-finder .bf-add-item {\n  position: relative;\n  display: block;\n  float: left;\n  width: 113px;\n  height: 113px;\n  margin: 5px;\n  overflow: hidden;\n  border-radius: 3px; }\n\n.braft-finder .bf-item.uploading {\n  pointer-events: none; }\n\n.braft-finder .bf-item.error::before {\n  display: block;\n  content: \"\\E901\"; }\n\n.braft-finder .bf-item.error::after {\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: rgba(231, 76, 60, 0.8);\n  content: ''; }\n\n.braft-finder .bf-item.error:hover::after {\n  background-color: rgba(231, 76, 60, 0.9); }\n\n.braft-finder .bf-item.error .bf-item-uploading {\n  display: none; }\n\n.braft-finder .bf-add-item {\n  background-color: #ecedef;\n  color: #999; }\n  .braft-finder .bf-add-item:hover {\n    background-color: #e1e2e3; }\n  .braft-finder .bf-add-item i {\n    display: block;\n    width: 113px;\n    height: 113px;\n    font-size: 48px;\n    line-height: 113px;\n    text-align: center; }\n  .braft-finder .bf-add-item input {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    cursor: pointer; }\n\n.braft-finder .bf-item::before {\n  display: none;\n  position: absolute;\n  z-index: 2;\n  top: 0;\n  left: 0;\n  width: 113px;\n  height: 113px;\n  color: #fff;\n  font-size: 48px;\n  font-family: 'bf-icons';\n  line-height: 113px;\n  text-align: center; }\n\n.braft-finder .bf-item::after {\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: rgba(52, 152, 219, 0);\n  content: ''; }\n\n.braft-finder .bf-item:hover::after {\n  background-color: rgba(52, 152, 219, 0.3); }\n\n.braft-finder .bf-item:hover .bf-item-remove {\n  display: block; }\n\n.braft-finder .bf-item.active::before {\n  display: block;\n  content: \"\\E912\"; }\n\n.braft-finder .bf-item.active::after {\n  background-color: rgba(52, 152, 219, 0.6); }\n\n.braft-finder .bf-item.active:hover::after {\n  background-color: rgba(52, 152, 219, 0.8); }\n\n.braft-finder .bf-item.active:hover .bf-item-remove {\n  display: none; }\n\n.braft-finder .bf-item-uploading {\n  box-sizing: border-box;\n  position: absolute;\n  z-index: 3;\n  top: 52px;\n  left: 10px;\n  width: 93px;\n  height: 10px;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.3);\n  border-radius: 5px;\n  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.5); }\n\n.braft-finder .bf-item-uploading-bar {\n  height: 10px;\n  background-color: #3498db;\n  border-radius: 0; }\n\n.braft-finder .bf-item-remove {\n  display: none;\n  position: absolute;\n  z-index: 2;\n  top: 0;\n  right: 0;\n  width: 28px;\n  height: 28px;\n  color: #fff;\n  font-size: 18px;\n  line-height: 28px;\n  text-align: center;\n  cursor: pointer; }\n  .braft-finder .bf-item-remove:hover {\n    color: #e74c3c; }\n\n.braft-finder .bf-item-title {\n  display: none;\n  box-sizing: border-box;\n  position: absolute;\n  z-index: 2;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 40px;\n  padding: 0 5px;\n  overflow: hidden;\n  background-image: linear-gradient(rgba(0, 0, 0, 0), black);\n  color: #fff;\n  font-size: 12px;\n  line-height: 55px;\n  text-align: center;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.braft-finder .bf-image {\n  width: 100%;\n  height: 100%;\n  background-color: #eee;\n  user-select: none; }\n  .braft-finder .bf-image img {\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover; }\n\n.braft-finder .bf-video {\n  background-color: #8e44ad; }\n\n.braft-finder .bf-audio {\n  background-color: #f39c12; }\n\n.braft-finder .bf-embed {\n  background-color: #f1c40f; }\n\n.braft-finder .bf-icon {\n  display: block;\n  width: 113px;\n  height: 113px;\n  overflow: hidden;\n  color: #fff;\n  text-align: center;\n  text-decoration: none; }\n  .braft-finder .bf-icon i, .braft-finder .bf-icon span {\n    display: block; }\n  .braft-finder .bf-icon i {\n    margin-top: 35px;\n    font-size: 24px; }\n  .braft-finder .bf-icon span {\n    width: 103px;\n    margin: 10px auto;\n    overflow: hidden;\n    font-size: 12px;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n\n.braft-finder .bf-drag-uploader {\n  box-sizing: border-box;\n  position: absolute;\n  z-index: 2;\n  top: 0;\n  right: 15px;\n  left: 15px;\n  height: 100%;\n  background-color: #fff;\n  border: dashed 1px #bbb;\n  text-align: center;\n  opacity: 0;\n  pointer-events: none; }\n  .braft-finder .bf-drag-uploader:hover, .braft-finder .bf-drag-uploader.draging {\n    background-color: #f1f2f3; }\n  .braft-finder .bf-drag-uploader.active {\n    opacity: 1;\n    pointer-events: auto; }\n\n.braft-finder .bf-uploader-buttons {\n  height: 370px;\n  margin: auto;\n  text-align: center; }\n\n.braft-finder .bf-drag-tip {\n  display: inline-block;\n  margin-top: 150px;\n  color: #ccc;\n  text-align: center;\n  font-size: 28px;\n  font-weight: normal;\n  line-height: 40px; }\n  .braft-finder .bf-drag-tip input {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    color: #fff;\n    text-indent: -100px;\n    cursor: pointer; }\n\n.braft-finder .bf-manager-footer {\n  height: 36px;\n  margin: 10px 0;\n  padding: 0 15px; }\n  .braft-finder .bf-manager-footer .button {\n    float: right;\n    height: 36px;\n    margin-left: 5px;\n    padding: 0 35px;\n    font-size: 12px;\n    font-weight: 700;\n    border: none;\n    border-radius: 3px;\n    cursor: pointer; }\n  .braft-finder .bf-manager-footer .button-insert {\n    color: #fff;\n    background-color: #3498db; }\n    .braft-finder .bf-manager-footer .button-insert:hover {\n      background-color: #2084c7; }\n    .braft-finder .bf-manager-footer .button-insert[disabled] {\n      opacity: .3;\n      pointer-events: none;\n      filter: grayscale(0.4); }\n  .braft-finder .bf-manager-footer .button-cancel {\n    color: #999;\n    background-color: #e8e8e9; }\n    .braft-finder .bf-manager-footer .button-cancel:hover {\n      background-color: #d8d8d9; }\n\n.braft-finder .bf-toggle-external-form {\n  color: #666;\n  font-size: 12px;\n  line-height: 36px; }\n  .braft-finder .bf-toggle-external-form span {\n    color: #bbb;\n    line-height: 16px;\n    cursor: pointer;\n    user-select: none; }\n    .braft-finder .bf-toggle-external-form span:hover {\n      color: #3498db; }\n    .braft-finder .bf-toggle-external-form span i {\n      position: relative;\n      top: 2px;\n      font-size: 16px; }\n\n.braft-finder .bf-add-external {\n  position: absolute;\n  z-index: 3;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: #fff; }\n  .braft-finder .bf-add-external input {\n    border: solid 1px rgba(0, 0, 0, 0.3);\n    border: solid 0.5px rgba(0, 0, 0, 0.3);\n    box-shadow: none; }\n    .braft-finder .bf-add-external input:focus {\n      border-color: #3498db;\n      box-shadow: none; }\n\n.braft-finder .bf-external-form {\n  width: 500px;\n  max-width: 90%;\n  margin: 91px auto 0 auto; }\n\n.braft-finder .bf-external-input {\n  position: relative;\n  width: 100%;\n  height: 40px;\n  margin-bottom: 10px; }\n  .braft-finder .bf-external-input div {\n    position: absolute;\n    top: 0;\n    right: 85px;\n    left: 0;\n    height: 40px; }\n  .braft-finder .bf-external-input input,\n  .braft-finder .bf-external-input textarea {\n    display: block;\n    box-sizing: border-box;\n    width: 100%;\n    height: 40px;\n    padding: 0 10px;\n    border: none;\n    border-radius: 3px;\n    outline: none;\n    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);\n    color: #999;\n    font-size: 18px; }\n    .braft-finder .bf-external-input input:focus,\n    .braft-finder .bf-external-input textarea:focus {\n      box-shadow: inset 0 0 0 1px #3498db; }\n  .braft-finder .bf-external-input textarea {\n    height: 100px;\n    font-size: 14px; }\n  .braft-finder .bf-external-input button {\n    position: absolute;\n    top: 0;\n    right: 0;\n    width: 80px;\n    height: 40px;\n    background-color: #3498db;\n    border: none;\n    border-radius: 3px;\n    color: #fff;\n    font-size: 14px;\n    font-weight: bold;\n    cursor: pointer; }\n    .braft-finder .bf-external-input button:disabled {\n      opacity: .3;\n      pointer-events: none;\n      filter: grayscale(0.4); }\n    .braft-finder .bf-external-input button:hover {\n      background-color: #2084c7; }\n\n.braft-finder .bf-switch-external-type {\n  overflow: hidden;\n  text-align: center; }\n  .braft-finder .bf-switch-external-type button {\n    width: auto;\n    height: 30px;\n    margin: 10px 5px;\n    padding: 0 10px;\n    background-color: #e8e9ea;\n    border: none;\n    border-radius: 3px;\n    color: #999;\n    font-size: 12px;\n    cursor: pointer; }\n    .braft-finder .bf-switch-external-type button:hover {\n      background-color: #d8d9da; }\n    .braft-finder .bf-switch-external-type button:only-child {\n      display: none; }\n  .braft-finder .bf-switch-external-type[data-type=\"IMAGE\"] [data-type=\"IMAGE\"],\n  .braft-finder .bf-switch-external-type[data-type=\"VIDEO\"] [data-type=\"VIDEO\"],\n  .braft-finder .bf-switch-external-type[data-type=\"AUDIO\"] [data-type=\"AUDIO\"],\n  .braft-finder .bf-switch-external-type[data-type=\"EMBED\"] [data-type=\"EMBED\"],\n  .braft-finder .bf-switch-external-type[data-type=\"FILE\"] [data-type=\"FILE\"] {\n    background-color: #3498db;\n    color: #fff; }\n\n.braft-finder .bf-external-tip {\n  display: block;\n  margin-top: 15px;\n  color: #ccc;\n  font-size: 12px;\n  text-align: center; }\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(16);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(12)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(17);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _base = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultAccepts = {
  image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
  video: 'video/mp4',
  audio: 'audio/mp3'
};

var BraftFinderView = function (_React$Component) {
  _inherits(BraftFinderView, _React$Component);

  function BraftFinderView(props) {
    _classCallCheck(this, BraftFinderView);

    var _this = _possibleConstructorReturn(this, (BraftFinderView.__proto__ || Object.getPrototypeOf(BraftFinderView)).call(this, props));

    _this.toggleSelectItem = function (event) {

      var itemId = event.currentTarget.dataset.id;
      var item = _this.controller.getMediaItem(itemId);

      if (!item) {
        return false;
      }

      if (item.selected) {

        if (!_this.props.onBeforeDeselect || _this.props.onBeforeDeselect([item], _this.controller.getItems()) !== false) {
          _this.controller.deselectMediaItem(itemId);
          _this.props.onDeselect && _this.props.onDeselect([item], _this.controller.getItems());
        }
      } else {

        if (!_this.props.onBeforeSelect || _this.props.onBeforeSelect([item], _this.controller.getItems()) !== false) {
          _this.controller.selectMediaItem(itemId);
          _this.props.onSelect && _this.props.onSelect([item], _this.controller.getItems());
        }
      }
    };

    _this.removeItem = function (event) {

      var itemId = event.currentTarget.dataset.id;
      var item = _this.controller.getMediaItem(itemId);

      if (!item) {
        return false;
      }

      if (!_this.props.onBeforeRemove || _this.props.onBeforeRemove([item], _this.controller.getItems()) !== false) {
        _this.controller.removeMediaItem(itemId);
        _this.props.onRemove && _this.props.onRemove([item], _this.controller.getItems());
      }

      event.stopPropagation();
    };

    _this.selectAllItems = function () {

      var allItems = _this.controller.getItems();

      if (!_this.props.onBeforeSelect || _this.props.onBeforeSelect(allItems, allItems) !== false) {
        _this.controller.selectAllItems();
        _this.props.onSelect && _this.props.onSelect(allItems, allItems);
      }
    };

    _this.deselectAllItems = function () {

      var allItems = _this.controller.getItems();

      if (!_this.props.onBeforeDeselect || _this.props.onBeforeDeselect(allItems, allItems) !== false) {
        _this.controller.deselectAllItems();
        _this.props.onDeselect && _this.props.onDeselect(allItems, allItems);
      }
    };

    _this.removeSelectedItems = function () {

      var selectedItems = _this.controller.getSelectedItems();

      if (!_this.props.onBeforeRemove || _this.props.onBeforeRemove(selectedItems, _this.controller.getItems()) !== false) {
        _this.controller.removeSelectedItems();
        _this.props.onRemove && _this.props.onRemove(selectedItems, _this.controller.getItems());
      }
    };

    _this.handleDragLeave = function (event) {
      event.preventDefault();
      _this.dragCounter--;
      _this.dragCounter === 0 && _this.setState({
        draging: false
      });
    };

    _this.handleDragDrop = function (event) {
      event.preventDefault();
      _this.dragCounter = 0;
      _this.setState({ draging: false });
      _this.reslovePickedFiles(event);
    };

    _this.handleDragEnter = function (event) {
      event.preventDefault();
      _this.dragCounter++;
      _this.setState({ draging: true });
    };

    _this.reslovePickedFiles = function (event) {

      event.persist();

      var _ref = event.type === 'drop' ? event.dataTransfer : event.target,
          files = _ref.files;

      if (_this.props.onFileSelect) {
        var result = _this.props.onFileSelect(files);
        if (result === false) {
          return false;
        } else if (result instanceof FileList || result instanceof Array) {
          files = result;
        }
      }

      var accepts = _extends({}, defaultAccepts, _this.props.accepts);

      _this.controller.resolveFiles({
        files: files,
        onItemReady: function onItemReady(_ref2) {
          var id = _ref2.id;
          return _this.controller.selectMediaItem(id);
        },
        onAllReady: function onAllReady() {
          return event.target.value = null;
        }
      }, 0, accepts);
    };

    _this.inputExternal = function (event) {
      _this.setState({
        external: _extends({}, _this.state.external, {
          url: event.target.value
        })
      });
    };

    _this.switchExternalType = function (event) {
      _this.setState({
        external: _extends({}, _this.state.external, { type: event.target.dataset.type })
      });
    };

    _this.confirmAddExternal = function (event) {

      if (event.target.nodeName.toLowerCase() === 'button' || event.keyCode === 13) {
        var _this$state$external = _this.state.external,
            url = _this$state$external.url,
            type = _this$state$external.type;

        url = url.split('|');
        var name = url.length > 1 ? url[0] : _this.props.language.unnamedItem;
        url = url.length > 1 ? url[1] : url[0];
        var thumbnail = type === 'IMAGE' ? url : null;

        _this.controller.addItems([{
          thumbnail: thumbnail, url: url, name: name, type: type,
          id: new Date().getTime() + '_' + (0, _base.UniqueIndex)(),
          uploading: false,
          uploadProgress: 1,
          selected: true
        }]);

        _this.setState({
          showExternalForm: false,
          external: {
            url: '',
            type: 'IMAGE'
          }
        });
      }
    };

    _this.toggleExternalForm = function () {
      _this.setState({
        showExternalForm: !_this.state.showExternalForm
      });
    };

    _this.cancelInsert = function () {
      _this.props.onCancel && _this.props.onCancel();
    };

    _this.confirmInsert = function () {

      var selectedItems = _this.controller.getSelectedItems();

      if (_this.props.onBeforeInsert) {

        var filteredItems = _this.props.onBeforeInsert(selectedItems);

        if (filteredItems && filteredItems instanceof Array) {
          _this.controller.deselectAllItems();
          _this.props.onInsert && _this.props.onInsert(filteredItems);
        } else if (filteredItems !== false) {
          _this.controller.deselectAllItems();
          _this.props.onInsert && _this.props.onInsert(selectedItems);
        }
      } else {
        _this.controller.deselectAllItems();
        _this.props.onInsert && _this.props.onInsert(selectedItems);
      }
    };

    _this.dragCounter = 0;
    _this.controller = _this.props.controller;
    var initialItems = _this.controller.getItems();

    _this.state = {
      draging: false,
      error: false,
      confirmable: initialItems.find(function (_ref3) {
        var selected = _ref3.selected;
        return selected;
      }),
      external: {
        url: '',
        type: 'IMAGE'
      },
      fileAccept: '',
      showExternalForm: false,
      allowExternal: false,
      items: initialItems
    };

    _this.changeListenerId = _this.controller.onChange(function (items) {
      _this.setState({ items: items, confirmable: items.find(function (_ref4) {
          var selected = _ref4.selected;
          return selected;
        }) });
      _this.props.onChange && _this.props.onChange(items);
    });

    return _this;
  }

  _createClass(BraftFinderView, [{
    key: 'mapPropsToState',
    value: function mapPropsToState(props) {
      var accepts = props.accepts,
          externals = props.externals;


      accepts = _extends({}, defaultAccepts, accepts);

      var fileAccept = !accepts ? [defaultAccepts.image, defaultAccepts.video, defaultAccepts.audio].join(',') : [accepts.image, accepts.video, accepts.audio].filter(function (item) {
        return item;
      }).join(',');

      var external = {
        url: '',
        type: externals.image ? 'IMAGE' : externals.audio ? 'AUDIO' : externals.video ? 'VIDEO' : externals.embed ? 'EMBED' : ''
      };

      return {
        fileAccept: fileAccept,
        external: external,
        allowExternal: externals && (externals.image || externals.audio || externals.video || externals.embed)
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState(this.mapPropsToState(this.props));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.mapPropsToState(nextProps));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.controller.offChange(this.changeListenerId);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          language = _props.language,
          externals = _props.externals;
      var _state = this.state,
          items = _state.items,
          draging = _state.draging,
          confirmable = _state.confirmable,
          fileAccept = _state.fileAccept,
          external = _state.external,
          showExternalForm = _state.showExternalForm,
          allowExternal = _state.allowExternal;


      return _react2.default.createElement(
        'div',
        { className: 'braft-finder' },
        _react2.default.createElement(
          'div',
          {
            onDragEnter: this.handleDragEnter,
            onDragOver: this.handleDragEnter,
            onDragLeave: this.handleDragLeave,
            onDrop: this.handleDragDrop,
            className: 'bf-uploader'
          },
          _react2.default.createElement(
            'div',
            { className: "bf-drag-uploader " + (draging || !items.length ? 'active ' : ' ') + (draging ? 'draging' : '') },
            _react2.default.createElement(
              'span',
              { className: 'bf-drag-tip' },
              _react2.default.createElement('input', { accept: fileAccept, onChange: this.reslovePickedFiles, multiple: true, type: 'file' }),
              draging ? language.dropTip : language.dragTip
            )
          ),
          items.length ? _react2.default.createElement(
            'div',
            { className: 'bf-list-wrap' },
            _react2.default.createElement(
              'div',
              { className: 'bf-list-tools' },
              _react2.default.createElement(
                'span',
                { onClick: this.selectAllItems, className: 'bf-select-all' },
                _react2.default.createElement('i', { className: 'braft-icon-done' }),
                ' ',
                language.selectAll
              ),
              _react2.default.createElement(
                'span',
                { onClick: this.deselectAllItems, disabled: !confirmable, className: 'bf-deselect-all' },
                _react2.default.createElement('i', { className: 'braft-icon-close' }),
                ' ',
                language.deselect
              ),
              _react2.default.createElement(
                'span',
                { onClick: this.removeSelectedItems, disabled: !confirmable, className: 'bf-remove-selected' },
                _react2.default.createElement('i', { className: 'braft-icon-bin' }),
                ' ',
                language.removeSelected
              )
            ),
            this.buildItemList()
          ) : null,
          showExternalForm && allowExternal ? _react2.default.createElement(
            'div',
            { className: 'bf-add-external' },
            _react2.default.createElement(
              'div',
              { className: 'bf-external-form' },
              _react2.default.createElement(
                'div',
                { className: 'bf-external-input' },
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement('input', { onKeyDown: this.confirmAddExternal, value: external.url, onChange: this.inputExternal, placeholder: language.externalInputPlaceHolder })
                ),
                _react2.default.createElement(
                  'button',
                  { type: 'button', onClick: this.confirmAddExternal, disabled: !external.url.trim().length },
                  language.confirm
                )
              ),
              _react2.default.createElement(
                'div',
                { 'data-type': external.type, className: 'bf-switch-external-type' },
                externals.image ? _react2.default.createElement(
                  'button',
                  { type: 'button', onClick: this.switchExternalType, 'data-type': 'IMAGE' },
                  language.image
                ) : null,
                externals.audio ? _react2.default.createElement(
                  'button',
                  { type: 'button', onClick: this.switchExternalType, 'data-type': 'AUDIO' },
                  language.audio
                ) : null,
                externals.video ? _react2.default.createElement(
                  'button',
                  { type: 'button', onClick: this.switchExternalType, 'data-type': 'VIDEO' },
                  language.video
                ) : null,
                externals.embed ? _react2.default.createElement(
                  'button',
                  { type: 'button', onClick: this.switchExternalType, 'data-type': 'EMBED' },
                  language.embed
                ) : null
              ),
              _react2.default.createElement(
                'span',
                { className: 'bf-external-tip' },
                language.externalInputTip
              )
            )
          ) : null
        ),
        _react2.default.createElement(
          'footer',
          { className: 'bf-manager-footer' },
          _react2.default.createElement(
            'div',
            { className: 'pull-left' },
            allowExternal ? _react2.default.createElement(
              'span',
              {
                onClick: this.toggleExternalForm,
                className: 'bf-toggle-external-form'
              },
              showExternalForm ? _react2.default.createElement(
                'span',
                { className: 'bf-bottom-text' },
                _react2.default.createElement('i', { className: 'braft-icon-add' }),
                ' ',
                language.addLocalFile
              ) : _react2.default.createElement(
                'span',
                { className: 'bf-bottom-text' },
                _react2.default.createElement('i', { className: 'braft-icon-add' }),
                ' ',
                language.addExternalSource
              )
            ) : null
          ),
          _react2.default.createElement(
            'div',
            { className: 'pull-right' },
            _react2.default.createElement(
              'button',
              { onClick: this.confirmInsert, className: 'button button-insert', disabled: !confirmable },
              language.insert
            ),
            _react2.default.createElement(
              'button',
              { onClick: this.cancelInsert, className: 'button button-cancel' },
              language.cancel
            )
          )
        )
      );
    }
  }, {
    key: 'buildItemList',
    value: function buildItemList() {
      var _this2 = this;

      return _react2.default.createElement(
        'ul',
        { className: 'bf-list' },
        _react2.default.createElement(
          'li',
          { className: 'bf-add-item' },
          _react2.default.createElement('i', { className: 'braft-icon-add' }),
          _react2.default.createElement('input', { accept: this.state.fileAccept, onChange: this.reslovePickedFiles, multiple: true, type: 'file' })
        ),
        this.state.items.map(function (item, index) {

          var previewerComponents = null;
          var progressMarker = item.uploading && !_this2.props.hideProgress ? _react2.default.createElement(
            'div',
            { className: 'bf-item-uploading' },
            _react2.default.createElement('div', { className: 'bf-item-uploading-bar', style: { width: item.uploadProgress / 1 + '%' } })
          ) : '';

          switch (item.type) {
            case 'IMAGE':
              previewerComponents = _react2.default.createElement(
                'div',
                { className: 'bf-image' },
                progressMarker,
                _react2.default.createElement('img', { src: item.thumbnail || item.url })
              );
              break;
            case 'VIDEO':
              previewerComponents = _react2.default.createElement(
                'div',
                { className: 'bf-icon bf-video', title: item.url },
                progressMarker,
                _react2.default.createElement('i', { className: 'braft-icon-film' }),
                _react2.default.createElement(
                  'span',
                  null,
                  item.name || item.url
                )
              );
              break;
            case 'AUDIO':
              previewerComponents = _react2.default.createElement(
                'div',
                { className: 'bf-icon bf-audio', title: item.url },
                progressMarker,
                _react2.default.createElement('i', { className: 'braft-icon-music' }),
                _react2.default.createElement(
                  'span',
                  null,
                  item.name || item.url
                )
              );
              break;
            case 'EMBED':
              previewerComponents = _react2.default.createElement(
                'div',
                { className: 'bf-icon bf-embed', title: item.url },
                progressMarker,
                _react2.default.createElement('i', { className: 'braft-icon-code' }),
                _react2.default.createElement(
                  'span',
                  null,
                  item.name || _this2.props.language.embed
                )
              );
              break;
            default:
              previewerComponents = _react2.default.createElement(
                'a',
                { className: 'bf-icon bf-file', title: item.url, href: item.url },
                progressMarker,
                _react2.default.createElement('i', { className: 'braft-icon-file-text' }),
                _react2.default.createElement(
                  'span',
                  null,
                  item.name || item.url
                )
              );
              break;
          }

          var className = ['bf-item'];
          item.selected && className.push('active');
          item.uploading && className.push('uploading');
          item.error && className.push('error');

          return _react2.default.createElement(
            'li',
            {
              key: index,
              title: item.name,
              'data-id': item.id,
              className: className.join(' '),
              onClick: _this2.toggleSelectItem
            },
            previewerComponents,
            _react2.default.createElement('span', { 'data-id': item.id, onClick: _this2.removeItem, className: 'bf-item-remove braft-icon-close' }),
            _react2.default.createElement(
              'span',
              { className: 'bf-item-title' },
              item.name
            )
          );
        })
      );
    }
  }]);

  return BraftFinderView;
}(_react2.default.Component);

BraftFinderView.defaultProps = {
  accepts: defaultAccepts,
  externals: {
    image: true,
    video: true,
    audio: true,
    embed: true
  }
};
exports.default = BraftFinderView;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _base = __webpack_require__(1);

var _image = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultValidator = function defaultValidator() {
  return true;
};

var BraftFinderController = function BraftFinderController() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, BraftFinderController);

  _initialiseProps.call(this);

  this.items = props.items || [];
  this.uploadFn = props.uploader;
  this.validateFn = props.validator || defaultValidator;

  this.changeListeners = [];
}

// resolvePastedFiles ({ clipboardData }, callback) {

//   if (clipboardData && clipboardData.items && clipboardData.items[0].type.indexOf('image') > -1) {
//     this.uploadImage(clipboardData.items[0].getAsFile(), callback)
//   }

// }

;

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.setProps = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    _this.items = props.items || _this.items || [];
    _this.uploadFn = props.uploader;
    _this.validateFn = props.validator || defaultValidator;
  };

  this.getMediaItem = function (id) {
    return _this.items.find(function (item) {
      return item.id === id;
    });
  };

  this.getSelectedItems = function () {
    return _this.items.filter(function (item) {
      return item.selected;
    });
  };

  this.getItems = function () {
    return _this.items;
  };

  this.setItems = function (items) {
    _this.items = items.map(function (item) {
      return _extends({}, item, { id: item.id.toString() });
    }) || [];
    _this.applyChange();
    _this.uploadItems();
  };

  this.addMediaItem = function (item) {
    _this.addItems([item]);
  };

  this.addItems = function (items) {
    _this.items = [].concat(_toConsumableArray(_this.items), _toConsumableArray(items.map(function (item) {
      return _extends({}, item, { id: item.id.toString() });
    })));
    _this.applyChange();
    _this.uploadItems();
  };

  this.selectMediaItem = function (id) {
    var item = _this.getMediaItem(id);
    if (item && (item.uploading || item.error)) {
      return false;
    }
    _this.setMediaItemState(id, {
      selected: true
    });
  };

  this.selectAllItems = function () {
    _this.items = _this.items.filter(function (item) {
      return !item.error && !item.uploading;
    }).map(function (item) {
      return _extends({}, item, { selected: true });
    });
    _this.applyChange();
  };

  this.deselectMediaItem = function (id) {
    _this.setMediaItemState(id, {
      selected: false
    });
  };

  this.deselectAllItems = function () {
    _this.items = _this.items.map(function (item) {
      return _extends({}, item, { selected: false });
    });
    _this.applyChange();
  };

  this.removeMediaItem = function (id) {
    _this.items = _this.items.filter(function (item) {
      return item.id !== id;
    });
    _this.applyChange();
  };

  this.removeItems = function () {
    var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _this.items = _this.items.filter(function (item) {
      return !ids.includes(item.id);
    });
    _this.applyChange();
  };

  this.removeSelectedItems = function () {
    _this.items = _this.items.filter(function (item) {
      return !item.selected;
    });
    _this.applyChange();
  };

  this.removeErrorItems = function () {
    _this.items = _this.items.filter(function (item) {
      return !item.error;
    });
    _this.applyChange();
  };

  this.removeAllItems = function () {
    _this.items = [];
    _this.applyChange();
  };

  this.setMediaItemState = function (id, state) {
    _this.items = _this.items.map(function (item) {
      return item.id === id ? _extends({}, item, state) : item;
    });
    _this.applyChange();
  };

  this.reuploadErrorItems = function () {
    _this.uploadItems(true);
  };

  this.uploadItems = function () {
    var ignoreError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


    _this.items.forEach(function (item, index) {

      if (item.uploading || item.url) {
        return false;
      }

      if (!ignoreError && item.error) {
        return false;
      }

      if (item.type === 'IMAGE') {
        _this.createThumbnail(item);
        _this.uploadFn = _this.uploadFn || _this.createInlineImage;
      } else if (!_this.uploadFn) {
        _this.setMediaItemState(item.id, { error: 1 });
        return false;
      }

      _this.setMediaItemState(item.id, {
        uploading: true,
        uploadProgress: 0,
        error: 0
      });

      _this.uploadFn({
        id: item.id,
        file: item.file,
        success: function success(res) {
          _this.handleUploadSuccess(item.id, res);
        },
        progress: function progress(_progress) {
          _this.setMediaItemState(item.id, {
            uploading: true,
            uploadProgress: _progress
          });
        },
        error: function error(_error) {
          _this.setMediaItemState(item.id, {
            uploading: false,
            error: 2
          });
        }
      });
    });
  };

  this.createThumbnail = function (_ref) {
    var id = _ref.id,
        file = _ref.file;


    (0, _image.compressImage)(URL.createObjectURL(file), 226, 226).then(function (result) {
      _this.setMediaItemState(id, { thumbnail: result.url });
    });
  };

  this.createInlineImage = function (param) {

    (0, _image.compressImage)(URL.createObjectURL(param.file), 1280, 800).then(function (result) {
      param.success({ url: result.url });
    }).catch(function (error) {
      param.error(error);
    });
  };

  this.handleUploadSuccess = function (id, data) {

    _this.setMediaItemState(id, _extends({}, data, {
      file: null,
      uploadProgress: 1,
      uploading: false,
      selected: false
    }));

    var item = _this.getMediaItem(data.id || id);
    item.onReady && item.onReady(item);
  };

  this.applyChange = function () {
    _this.changeListeners.forEach(function (_ref2) {
      var callback = _ref2.callback;
      return callback(_this.items);
    });
  };

  this.uploadImage = function (file, callback) {

    var fileId = new Date().getTime() + '_' + (0, _base.UniqueIndex)();

    _this.addMediaItem({
      type: 'IMAGE',
      id: fileId,
      file: file,
      name: fileId,
      size: file.size,
      uploadProgress: 0,
      uploading: false,
      selected: false,
      error: 0,
      onReady: callback
    });
  };

  this.uploadImageRecursively = function (files, callback) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;


    if (files[index] && files[index].type.indexOf('image') > -1) {
      _this.uploadImage(files[index], function (image) {
        callback && callback(image);
        index < files.length - 1 && _this.uploadImageRecursively(files, callback, index + 1);
      });
    } else {
      index < files.length - 1 && _this.uploadImageRecursively(files, callback, index + 1);
    }
  };

  this.addResolvedFiles = function (param, index, accepts) {

    var data = {
      id: new Date().getTime() + '_' + (0, _base.UniqueIndex)(),
      file: param.files[index],
      name: param.files[index].name,
      size: param.files[index].size,
      uploadProgress: 0,
      uploading: false,
      selected: false,
      error: 0,
      onReady: function onReady(item) {
        param.onItemReady && param.onItemReady(item);
      }
    };

    if (param.files[index].type.indexOf('image/') === 0 && accepts.image) {
      data.type = 'IMAGE';
      _this.addMediaItem(data);
    } else if (param.files[index].type.indexOf('video/') === 0 && accepts.video) {
      data.type = 'VIDEO';
      _this.addMediaItem(data);
    } else if (param.files[index].type.indexOf('audio/') === 0 && accepts.audio) {
      data.type = 'AUDIO';
      _this.addMediaItem(data);
    }

    setTimeout(function () {
      _this.resolveFiles(param, index + 1, accepts);
    }, 60);
  };

  this.resolveFiles = function (param, index, accepts) {

    if (index < param.files.length) {

      var validateResult = _this.validateFn(param.files[index]);

      if (validateResult instanceof Promise) {
        validateResult.then(function () {
          _this.addResolvedFiles(param, index, accepts);
        });
      } else if (validateResult) {
        _this.addResolvedFiles(param, index, accepts);
      }
    } else {
      param.onAllReady && param.onAllReady();
    }
  };

  this.onChange = function (callback) {

    var listenerId = (0, _base.UniqueIndex)();

    _this.changeListeners.push({
      id: listenerId,
      callback: callback
    });

    return listenerId;
  };

  this.offChange = function (listenerId) {
    _this.changeListeners = _this.changeListeners.filter(function (_ref3) {
      var id = _ref3.id;
      return id !== listenerId;
    });
  };
};

exports.default = BraftFinderController;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageUtils = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _controller = __webpack_require__(19);

var _controller2 = _interopRequireDefault(_controller);

var _view = __webpack_require__(18);

var _view2 = _interopRequireDefault(_view);

var _languages = __webpack_require__(10);

var _languages2 = _interopRequireDefault(_languages);

var _image = __webpack_require__(0);

var ImageUtils = _interopRequireWildcard(_image);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BraftFinder = function (_FinderController) {
  _inherits(BraftFinder, _FinderController);

  function BraftFinder(props) {
    _classCallCheck(this, BraftFinder);

    var _this = _possibleConstructorReturn(this, (BraftFinder.__proto__ || Object.getPrototypeOf(BraftFinder)).call(this, props));

    _initialiseProps.call(_this);

    _this.superProps = props;
    return _this;
  }

  return BraftFinder;
}(_controller2.default);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.ReactComponent = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var componentProps = _extends({}, _this2.superProps, props);

    var language = (typeof componentProps.language === 'function' ? componentProps.language(_languages2.default, 'braft-finder') : _languages2.default[componentProps.language]) || _languages2.default['zh'];

    return _react2.default.createElement(_view2.default, _extends({}, componentProps, {
      language: language,
      controller: _this2
    }));
  };
};

exports.default = BraftFinder;
exports.ImageUtils = ImageUtils;

/***/ })
/******/ ]);
});