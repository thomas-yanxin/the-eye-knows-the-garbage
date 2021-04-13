"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asap = asap;

var _raw = require("./raw");

var freeTasks = [];
/**
 * Calls a task as soon as possible after returning, in its own event, with
 * priority over IO events. An exception thrown in a task can be handled by
 * `process.on("uncaughtException") or `domain.on("error")`, but will otherwise
 * crash the process. If the error is handled, all subsequent tasks will
 * resume.
 *
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */

function asap(task) {
  var rawTask;

  if (freeTasks.length) {
    rawTask = freeTasks.pop();
  } else {
    rawTask = new RawTask();
  }

  rawTask.task = task;
  rawTask.domain = process.domain;
  (0, _raw.rawAsap)(rawTask);
}

var RawTask =
/** @class */
function () {
  function RawTask() {}

  RawTask.prototype.call = function () {
    if (this.domain) {
      this.domain.enter();
    }

    var threw = true;

    try {
      this.task.call();
      threw = false; // If the task throws an exception (presumably) Node.js restores the
      // domain stack for the next event.

      if (this.domain) {
        this.domain.exit();
      }
    } finally {
      // We use try/finally and a threw flag to avoid messing up stack traces
      // when we catch and release errors.
      if (threw) {
        // In Node.js, uncaught exceptions are considered fatal errors.
        // Re-throw them to interrupt flushing!
        // Ensure that flushing continues if an uncaught exception is
        // suppressed listening process.on("uncaughtException") or
        // domain.on("error").
        _raw.rawAsap.requestFlush();
      } // If the task threw an error, we do not want to exit the domain here.
      // Exiting the domain would prevent the domain from catching the error.


      this.task = null;
      this.domain = null;
      freeTasks.push(this);
    }
  };

  return RawTask;
}();