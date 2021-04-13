"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = updateMutation;

function updateMutation(mutation, originalOffset, originalLength, newLength, prefixLength, suffixLength) {
  // three cases we can reasonably adjust - disjoint mutations that
  // happen later on where the offset will need to be changed,
  // mutations that completely contain the new one where we can adjust
  // the length, and mutations that occur partially within the new one.
  var lengthDiff = newLength - originalLength;
  var mutationAfterChange = originalOffset + originalLength <= mutation.offset;

  if (mutationAfterChange) {
    return Object.assign({}, mutation, {
      offset: mutation.offset + lengthDiff
    });
  }

  var mutationContainsChange = originalOffset >= mutation.offset && originalOffset + originalLength <= mutation.offset + mutation.length;

  if (mutationContainsChange) {
    return Object.assign({}, mutation, {
      length: mutation.length + lengthDiff
    });
  }

  var mutationWithinPrefixChange = mutation.offset >= originalOffset && mutation.offset + mutation.length <= originalOffset + originalLength && prefixLength > 0;

  if (mutationWithinPrefixChange) {
    return Object.assign({}, mutation, {
      offset: mutation.offset + prefixLength
    });
  }

  var mutationContainsPrefix = mutation.offset < originalOffset && mutation.offset + mutation.length <= originalOffset + originalLength && mutation.offset + mutation.length > originalOffset && prefixLength > 0;

  if (mutationContainsPrefix) {
    return [Object.assign({}, mutation, {
      length: originalOffset - mutation.offset
    }), Object.assign({}, mutation, {
      offset: originalOffset + prefixLength,
      length: mutation.offset - originalOffset + mutation.length
    })];
  }

  var mutationContainsSuffix = mutation.offset >= originalOffset && mutation.offset + mutation.length > originalOffset + originalLength && originalOffset + originalLength > mutation.offset && suffixLength > 0;

  if (mutationContainsSuffix) {
    return [Object.assign({}, mutation, {
      offset: mutation.offset + prefixLength,
      length: originalOffset + originalLength - mutation.offset
    }), Object.assign({}, mutation, {
      offset: originalOffset + originalLength + prefixLength + suffixLength,
      length: mutation.offset + mutation.length - (originalOffset + originalLength)
    })];
  }

  return mutation;
}