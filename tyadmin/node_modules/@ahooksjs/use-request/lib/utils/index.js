"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = exports.isDocumentVisible = void 0;

function isDocumentVisible() {
  if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
    return document.visibilityState !== 'hidden';
  }

  return true;
}

exports.isDocumentVisible = isDocumentVisible;

function isOnline() {
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }

  return true;
}

exports.isOnline = isOnline;