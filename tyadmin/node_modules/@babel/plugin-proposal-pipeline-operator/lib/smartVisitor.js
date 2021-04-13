"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

const updateTopicReferenceVisitor = {
  PipelinePrimaryTopicReference(path) {
    path.replaceWith(this.topicId);
  },

  PipelineTopicExpression(path) {
    path.skip();
  }

};
const smartVisitor = {
  BinaryExpression(path) {
    const {
      scope
    } = path;
    const {
      node
    } = path;
    const {
      operator,
      left,
      right
    } = node;
    if (operator !== "|>") return;
    const placeholder = scope.generateUidIdentifierBasedOnNode(left);
    scope.push({
      id: placeholder
    });
    let call;

    if (_core.types.isPipelineTopicExpression(right)) {
      path.get("right").traverse(updateTopicReferenceVisitor, {
        topicId: placeholder
      });
      call = right.expression;
    } else {
      let callee = right.callee;

      if (_core.types.isIdentifier(callee, {
        name: "eval"
      })) {
        callee = _core.types.sequenceExpression([_core.types.numericLiteral(0), callee]);
      }

      call = _core.types.callExpression(callee, [_core.types.cloneNode(placeholder)]);
    }

    path.replaceWith(_core.types.sequenceExpression([_core.types.assignmentExpression("=", _core.types.cloneNode(placeholder), left), call]));
  }

};
var _default = smartVisitor;
exports.default = _default;