import HTML5Backend from './HTML5Backend';
import * as NativeTypes from './NativeTypes';
export { getEmptyImage } from './getEmptyImage';
export { NativeTypes };

var createBackend = function createBackend(manager, context) {
  return new HTML5Backend(manager, context);
};

export default createBackend;