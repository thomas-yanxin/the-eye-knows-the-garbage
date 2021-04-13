import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return value !== undefined ? [value] : [];
}
/**
 * Convert outer props value into internal value
 */

export function toInnerValue(value, _ref) {
  var labelInValue = _ref.labelInValue,
      combobox = _ref.combobox;

  if (value === undefined || value === '' && combobox) {
    return [];
  }

  var values = Array.isArray(value) ? value : [value];

  if (labelInValue) {
    return values.map(function (_ref2) {
      var key = _ref2.key,
          val = _ref2.value;
      return val !== undefined ? val : key;
    });
  }

  return values;
}
/**
 * Convert internal value into out event value
 */

export function toOuterValues(valueList, _ref3) {
  var optionLabelProp = _ref3.optionLabelProp,
      labelInValue = _ref3.labelInValue,
      prevValue = _ref3.prevValue,
      options = _ref3.options,
      getLabeledValue = _ref3.getLabeledValue;
  var values = valueList;

  if (labelInValue) {
    values = values.map(function (val) {
      return getLabeledValue(val, {
        options: options,
        prevValue: prevValue,
        labelInValue: labelInValue,
        optionLabelProp: optionLabelProp
      });
    });
  }

  return values;
}
export function removeLastEnabledValue(measureValues, values) {
  var newValues = _toConsumableArray(values);

  var removeIndex;

  for (removeIndex = measureValues.length - 1; removeIndex >= 0; removeIndex -= 1) {
    if (!measureValues[removeIndex].disabled) {
      break;
    }
  }

  var removedValue = null;

  if (removeIndex !== -1) {
    removedValue = newValues[removeIndex];
    newValues.splice(removeIndex, 1);
  }

  return {
    values: newValues,
    removedValue: removedValue
  };
}
export var isClient = typeof window !== 'undefined' && window.document && window.document.documentElement;
/** Is client side and not jsdom */

export var isBrowserClient = process.env.NODE_ENV !== 'test' && isClient;
var uuid = 0;
/** Get unique id for accessibility usage */

export function getUUID() {
  var retId; // Test never reach

  /* istanbul ignore if */

  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }

  return retId;
}