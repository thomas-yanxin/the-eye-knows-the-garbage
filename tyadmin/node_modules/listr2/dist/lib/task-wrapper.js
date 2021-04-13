"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskWrapper = void 0;
const through_1 = __importDefault(require("through"));
const listr_interface_1 = require("../interfaces/listr.interface");
const state_constants_1 = require("../interfaces/state.constants");
const index_1 = require("../index");
const prompt_1 = require("../utils/prompt");
class TaskWrapper {
    constructor(task, errors, options) {
        this.task = task;
        this.errors = errors;
        this.options = options;
    }
    set title(title) {
        this.task.title = title;
        this.task.next({
            type: 'TITLE',
            data: title
        });
    }
    get title() {
        return this.task.title;
    }
    set output(data) {
        this.task.output = data;
        this.task.next({
            type: 'DATA',
            data
        });
    }
    get output() {
        return this.task.output;
    }
    set state(data) {
        this.task.state = data;
        this.task.next({
            type: 'STATE',
            data
        });
    }
    newListr(task, options) {
        return new index_1.Listr(task, options);
    }
    report(error) {
        var _a, _b;
        if (error instanceof listr_interface_1.ListrError) {
            for (const err of error.errors) {
                this.errors.push(err);
                this.output = err.message || ((_a = this.task) === null || _a === void 0 ? void 0 : _a.title) || 'Task with no title.';
            }
        }
        else {
            this.errors.push(error);
            this.output = error.message || ((_b = this.task) === null || _b === void 0 ? void 0 : _b.title) || 'Task with no title.';
        }
    }
    skip(message) {
        var _a;
        this.state = state_constants_1.stateConstants.SKIPPED;
        if (message) {
            this.output = message || ((_a = this.task) === null || _a === void 0 ? void 0 : _a.title) || 'Task with no title.';
        }
    }
    async prompt(options) {
        var _a;
        this.task.prompt = true;
        return prompt_1.createPrompt.bind(this)(options, { ...(_a = this.options) === null || _a === void 0 ? void 0 : _a.injectWrapper });
    }
    stdout() {
        return through_1.default((chunk) => {
            const pattern = new RegExp('(?:\\u001b|\\u009b)\\[[\\=><~/#&.:=?%@~_-]*[0-9]*[\\a-ln-tqyz=><~/#&.:=?%@~_-]+', 'gmi');
            chunk = chunk.toString();
            chunk = chunk.replace(pattern, '');
            chunk = chunk.replace(new RegExp(/\u0007/, 'gmi'), '');
            if (chunk !== '') {
                this.output = chunk;
            }
        });
    }
    run(ctx) {
        return this.task.run(ctx, this);
    }
}
exports.TaskWrapper = TaskWrapper;
//# sourceMappingURL=task-wrapper.js.map