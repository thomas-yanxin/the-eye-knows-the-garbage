import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useRef, useState, useEffect } from 'react';
import raf from 'raf';
export function useFrameState(defaultState) {
  var stateRef = useRef(defaultState);

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      forceUpdate = _useState2[1];

  var timeoutRef = useRef(null);
  var updateBatchRef = useRef([]);

  function setFrameState(updater) {
    if (timeoutRef.current === null) {
      updateBatchRef.current = [];
      timeoutRef.current = raf(function () {
        updateBatchRef.current.forEach(function (batchUpdater) {
          stateRef.current = batchUpdater(stateRef.current);
        });
        timeoutRef.current = null;
        forceUpdate({});
      });
    }

    updateBatchRef.current.push(updater);
  }

  useEffect(function () {
    return function () {
      raf.cancel(timeoutRef.current);
    };
  }, []);
  return [stateRef.current, setFrameState];
}
/** Lock frame, when frame pass reset the lock. */

export function useTimeoutLock(defaultState) {
  var frameRef = useRef(defaultState);
  var timeoutRef = useRef(null);

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

  useEffect(function () {
    return cleanUp;
  }, []);
  return [setState, getState];
}