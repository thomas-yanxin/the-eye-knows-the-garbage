"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFrameState = useFrameState;
exports.useTimeoutLock = useTimeoutLock;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _raf = _interopRequireDefault(require("raf"));

function useFrameState(defaultState) {
  var stateRef = (0, _react.useRef)(defaultState);

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      forceUpdate = _useState2[1];

  var timeoutRef = (0, _react.useRef)(null);
  var updateBatchRef = (0, _react.useRef)([]);

  function setFrameState(updater) {
    if (timeoutRef.current === null) {
      updateBatchRef.current = [];
      timeoutRef.current = (0, _raf.default)(function () {
        updateBatchRef.current.forEach(function (batchUpdater) {
          stateRef.current = batchUpdater(stateRef.current);
        });
        timeoutRef.current = null;
        forceUpdate({});
      });
    }

    updateBatchRef.current.push(updater);
  }

  (0, _react.useEffect)(function () {
    return function () {
      _raf.default.cancel(timeoutRef.current);
    };
  }, []);
  return [stateRef.current, setFrameState];
}
/** Lock frame, when frame pass reset the lock. */


function useTimeoutLock(defaultState) {
  var frameRef = (0, _react.useRef)(defaultState);
  var timeoutRef = (0, _react.useRef)(null);

  function cleanUp() {
    window.clearTimeout(timeoutRef.current);
  }

  function setState(newState) {
    frameRef.current = newState;
    cleanUp();
    timeoutRef.current = window.setTimeout(function () {
      frameRef.current = null;
      timeoutRef.current = null;
    }, 100);
  }

  function getState() {
    return frameRef.current;
  }

  (0, _react.useEffect)(function () {
    return cleanUp;
  }, []);
  return [setState, getState];
}