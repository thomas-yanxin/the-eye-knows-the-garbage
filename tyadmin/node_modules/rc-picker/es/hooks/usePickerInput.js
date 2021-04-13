import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect, useRef } from 'react';
import KeyCode from "rc-util/es/KeyCode";
import { addGlobalMouseDownEvent } from '../utils/uiUtil';
export default function usePickerInput(_ref) {
  var open = _ref.open,
      value = _ref.value,
      isClickOutside = _ref.isClickOutside,
      triggerOpen = _ref.triggerOpen,
      forwardKeyDown = _ref.forwardKeyDown,
      blurToCancel = _ref.blurToCancel,
      onSubmit = _ref.onSubmit,
      onCancel = _ref.onCancel,
      _onFocus = _ref.onFocus,
      _onBlur = _ref.onBlur;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      typing = _useState2[0],
      setTyping = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      focused = _useState4[0],
      setFocused = _useState4[1];
  /**
   * We will prevent blur to handle open event when user click outside,
   * since this will repeat trigger `onOpenChange` event.
   */


  var preventBlurRef = useRef(false);
  var valueChangedRef = useRef(false);
  var inputProps = {
    onMouseDown: function onMouseDown() {
      setTyping(true);
      triggerOpen(true);
    },
    onKeyDown: function onKeyDown(e) {
      switch (e.which) {
        case KeyCode.ENTER:
          {
            if (!open) {
              triggerOpen(true);
            } else if (onSubmit() !== false) {
              setTyping(true);
            }

            e.preventDefault();
            return;
          }

        case KeyCode.TAB:
          {
            if (typing && open && !e.shiftKey) {
              setTyping(false);
              e.preventDefault();
            } else if (!typing && open) {
              if (!forwardKeyDown(e) && e.shiftKey) {
                setTyping(true);
                e.preventDefault();
              }
            }

            return;
          }

        case KeyCode.ESC:
          {
            setTyping(true);
            onCancel();
            return;
          }
      }

      if (!open && ![KeyCode.SHIFT].includes(e.which)) {
        triggerOpen(true);
      } else if (!typing) {
        // Let popup panel handle keyboard
        forwardKeyDown(e);
      }
    },
    onFocus: function onFocus(e) {
      setTyping(true);
      setFocused(true);

      if (_onFocus) {
        _onFocus(e);
      }
    },
    onBlur: function onBlur(e) {
      if (preventBlurRef.current || !isClickOutside(document.activeElement)) {
        preventBlurRef.current = false;
        return;
      }

      if (blurToCancel) {
        setTimeout(function () {
          if (isClickOutside(document.activeElement)) {
            onCancel();
          }
        }, 0);
      } else if (open) {
        triggerOpen(false);

        if (valueChangedRef.current) {
          onSubmit();
        }
      }

      setFocused(false);

      if (_onBlur) {
        _onBlur(e);
      }
    }
  }; // check if value changed

  useEffect(function () {
    valueChangedRef.current = false;
  }, [open]);
  useEffect(function () {
    valueChangedRef.current = true;
  }, [value]); // Global click handler

  useEffect(function () {
    return addGlobalMouseDownEvent(function (_ref2) {
      var target = _ref2.target;

      if (open) {
        if (!isClickOutside(target)) {
          preventBlurRef.current = true; // Always set back in case `onBlur` prevented by user

          requestAnimationFrame(function () {
            preventBlurRef.current = false;
          });
        } else if (!focused) {
          triggerOpen(false);
        }
      }
    });
  });
  return [inputProps, {
    focused: focused,
    typing: typing
  }];
}