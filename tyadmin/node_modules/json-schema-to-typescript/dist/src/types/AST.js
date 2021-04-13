"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasComment(ast) {
    return 'comment' in ast && ast.comment != null && ast.comment !== '';
}
exports.hasComment = hasComment;
function hasStandaloneName(ast) {
    return 'standaloneName' in ast && ast.standaloneName != null && ast.standaloneName !== '';
}
exports.hasStandaloneName = hasStandaloneName;
////////////////////////////////////////////     literals
exports.T_ANY = {
    type: 'ANY'
};
exports.T_ANY_ADDITIONAL_PROPERTIES = {
    keyName: '[k: string]',
    type: 'ANY'
};
//# sourceMappingURL=AST.js.map